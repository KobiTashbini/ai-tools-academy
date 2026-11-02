import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PGlite} from '@electric-sql/pglite';
import {prepareDatabase} from '../scripts/prepare-database.mjs';
import {readDatabaseCatalog} from '../src/data/database-catalog.mjs';
import {reviewAdditions,reviewCorrections} from '../database/seeds/rag-review.mjs';
const sql=name=>readFileSync(new URL('../database/'+name,import.meta.url),'utf8');

test('approved RAG review adds only three candidates and corrects eight entries without changing schema or cohorts',async()=>{
 const db=new PGlite();
 try{
  await db.exec(sql('001_catalog.sql'));await db.exec(prepareDatabase().sql);
  for(const file of ['002_normalize.sql','003_merge_catalog_descriptions.sql','004_detach_archive.sql','005_developer_survey_usage.sql','006_add_agent_frameworks.sql','007_add_rag_systems.sql'])await db.exec(sql(file));
  const before=await readDatabaseCatalog(db);
  const columns=(await db.query("select table_name,column_name,data_type from information_schema.columns where table_schema='academy' order by table_name,ordinal_position")).rows;
  const cohorts=(await db.query('select * from academy.cohort_observations order by cohort_id,repository_url')).rows;
  const observations=(await db.query('select count(*)::int n from academy.repository_snapshots')).rows[0].n;
  await db.query("update academy.entries set revision=revision+1 where slug='llamaindex'");
  await assert.rejects(db.exec(sql('008_apply_rag_review.sql')),/Reviewed entries changed/);
  await db.exec('rollback');
  assert.equal((await db.query("select count(*)::int n from academy.entries where slug='dspy'")).rows[0].n,0);
  await db.query("update academy.entries set revision=revision-1 where slug='llamaindex'");
  await db.exec(sql('008_apply_rag_review.sql'));
  const after=await readDatabaseCatalog(db);
  assert.equal(after.entries.length,before.entries.length+3);
  assert.equal(after.entries.filter(e=>e.categoryIds.includes('04')).length,11);
  assert.deepEqual(after.entries.filter(e=>!e.categoryIds.includes('04')),before.entries.filter(e=>!e.categoryIds.includes('04')));
  assert.deepEqual((await db.query("select table_name,column_name,data_type from information_schema.columns where table_schema='academy' order by table_name,ordinal_position")).rows,columns);
  assert.deepEqual((await db.query('select * from academy.cohort_observations order by cohort_id,repository_url')).rows,cohorts);
  assert.equal((await db.query('select count(*)::int n from academy.repository_snapshots')).rows[0].n,observations+10);
  for(const a of reviewAdditions){
   const e=after.entries.find(e=>e.slug===a.slug),f=after.facts[a.slug],m=after.metrics[a.slug];
   assert.equal(after.entries.filter(e=>e.name===a.name).length,1);assert.equal(e.kind,a.kind);
   assert.equal(e.summary,a.summary);assert.equal(e.example,a.example);assert.equal(e.learningPriority,a.priority);
   assert.deepEqual(e.sections,a.sections.map(([title,text])=>({title,text})));
   assert.equal(e.languageSupportNote,a.languageSupportNote);assert.deepEqual(e.relatedSlugs,a.related);
   assert.equal(e.addedAtBasis,'approved_proposal');assert.match(e.approvalReference,/D-031/);
   assert.equal(m.learningReason,a.reason);assert.equal(m.communityInterest,undefined);
   assert.equal(f.release.value,a.release.date??String(a.release.year));assert.equal(f.release.source,a.release.source);
  }
  for(const c of reviewCorrections){
   const old=before.entries.find(e=>e.slug===c.slug),e=after.entries.find(e=>e.slug===c.slug);
   assert.equal(e.kind,old.kind);assert.deepEqual(e.categoryIds,old.categoryIds);assert.equal(e.learningPriority,old.learningPriority);
   assert.equal(e.revision,old.revision+1);assert.equal(e.sections.length,old.sections.length+1);
   assert.deepEqual(e.sections.slice(0,-1),old.sections);assert.equal(e.sections.at(-1).text,c.section[1]);
   for(const source of old.sources)assert.ok(e.sources.some(s=>s.url===source.url),'original source retained');
   if(c.release){assert.equal(after.facts[c.slug].release.value,c.release.date??String(c.release.year));assert.equal(after.facts[c.slug].release.note,c.release.note);}
   if(c.languageSupportNote)assert.equal(e.languageSupportNote,c.languageSupportNote);
  }
  assert.equal(after.entries.find(e=>e.slug==='llamaindex').lifecycle,undefined);
  assert.deepEqual(after.metrics.llamaindex.languages,['Python','TypeScript (Legacy)']);
  assert.deepEqual(after.metrics.ragflow.languages,['Go','Python SDK','HTTP API']);
  assert.match(after.entries.find(e=>e.slug==='pathway').sections.map(s=>s.text).join(' '),/BSL/);
  assert.equal(after.guides['04'].steps.length,7);
  for(const slug of ['cognee','rag-anything','onyx','serviette','r2r','kotaemon','cognita','kernel-memory','fastgpt','quivr'])assert.ok(!after.entries.some(e=>e.slug===slug));
  const evidence=JSON.parse(readFileSync(new URL('../database/evidence/rag-review-2026-11-02.json',import.meta.url),'utf8'));
  for(const snapshot of evidence){const [slug]=Object.entries(after.facts).find(([,f])=>f.github.url===snapshot.url);const f=after.facts[slug];assert.equal(f.github.stars,snapshot.stars);assert.equal(Date.parse(f.github.collectedAt),Date.parse(snapshot.collectedAt));assert.equal(f.github.lastActivity.source,snapshot.commitSource);}
  const checks=(await db.query(sql('verify_catalog.sql'))).rows;
  assert.equal(checks.find(r=>r.check_name==='entries_changed_since_import').actual,'16');
  for(const name of ['damaged_archive_documents','live_json_columns','tables_without_rls','missing_archive_guards','archive_live_foreign_keys'])assert.equal(checks.find(r=>r.check_name===name).actual,'0');
  await assert.rejects(db.exec(sql('008_apply_rag_review.sql')),/Expected schema version 7/);await db.exec('rollback');
  assert.equal((await readDatabaseCatalog(db)).entries.length,after.entries.length);
 }finally{await db.close();}
});
