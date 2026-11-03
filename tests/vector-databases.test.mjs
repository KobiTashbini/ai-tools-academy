import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PGlite} from '@electric-sql/pglite';
import {prepareDatabase} from '../scripts/prepare-database.mjs';
import {readDatabaseCatalog} from '../src/data/database-catalog.mjs';
import {vectorAdditions,qdrantCorrection,vectorGuide} from '../database/seeds/vector-databases.mjs';
const sql=name=>readFileSync(new URL('../database/'+name,import.meta.url),'utf8');
test('approved vector review adds seven chapters and corrects Qdrant atomically without schema or unrelated content changes',async()=>{
 const db=new PGlite();
 try{
  await db.exec(sql('001_catalog.sql'));await db.exec(prepareDatabase().sql);
  for(const file of ['002_normalize.sql','003_merge_catalog_descriptions.sql','004_detach_archive.sql','005_developer_survey_usage.sql','006_add_agent_frameworks.sql','007_add_rag_systems.sql','008_apply_rag_review.sql'])await db.exec(sql(file));
  const before=await readDatabaseCatalog(db),old=before.entries.find(e=>e.slug==='qdrant');
  const schema=async()=>(await db.query("select table_name,column_name,data_type from information_schema.columns where table_schema='academy' order by table_name,ordinal_position")).rows;
  const columns=await schema(),cohorts=(await db.query('select * from academy.cohort_observations order by cohort_id,repository_url')).rows;
  const snapshotCount=(await db.query('select count(*)::int n from academy.repository_snapshots')).rows[0].n;
  // Conflicting content revisions must fail before inserting anything.
  await db.query("update academy.entries set revision=3 where slug='qdrant'");
  await assert.rejects(db.exec(sql('009_add_vector_databases.sql')),/Reviewed Qdrant changed/);await db.exec('rollback');
  assert.equal((await db.query("select count(*)::int n from academy.entries where slug='pgvector'")).rows[0].n,0);
  await db.query("update academy.entries set revision=2 where slug='qdrant'");
  // Canonical repository collision must fail even with a different product name.
  await db.query("insert into academy.repositories(url,entry_id,scope_note) values ('https://github.com/pgvector/pgvector','rag-fundamentals','test collision')");
  await assert.rejects(db.exec(sql('009_add_vector_databases.sql')),/Candidate repository already represented/);await db.exec('rollback');
  await db.query("delete from academy.repositories where url='https://github.com/pgvector/pgvector'");
  await db.exec(sql('009_add_vector_databases.sql'));
  const after=await readDatabaseCatalog(db),scope=after.entries.filter(e=>e.categoryIds.includes('05'));
  assert.equal(after.entries.length,57);assert.equal(scope.length,8);
  assert.deepEqual(after.entries.filter(e=>!e.categoryIds.includes('05')),before.entries.filter(e=>!e.categoryIds.includes('05')));
  for(const e of before.entries.filter(e=>e.slug!=='qdrant')){assert.deepEqual(after.facts[e.slug],before.facts[e.slug]);assert.deepEqual(after.metrics[e.slug],before.metrics[e.slug]);}
  assert.deepEqual(await schema(),columns);assert.deepEqual((await db.query('select * from academy.cohort_observations order by cohort_id,repository_url')).rows,cohorts);
  assert.equal((await db.query('select count(*)::int n from academy.repository_snapshots')).rows[0].n,snapshotCount+5);
  for(const a of vectorAdditions){
   const e=scope.find(e=>e.slug===a.slug),f=after.facts[a.slug],m=after.metrics[a.slug];
   assert.equal(scope.filter(e=>e.name===a.name).length,1);assert.equal(e.kind,a.kind);assert.equal(e.revision,1);
   assert.equal(e.summary,a.summary);assert.equal(e.example,a.example);assert.equal(e.exercise,a.exercise);
   assert.equal(e.languageSupportNote,a.languageSupportNote);assert.equal(e.alternativesNote,a.alternativesNote);
   assert.deepEqual(e.sections,a.sections.map(([title,text])=>({title,text})));
   assert.deepEqual(e.relatedSlugs,a.related);assert.equal(e.learningPriority,a.priority);assert.equal(m.learningReason,a.reason);
   assert.equal(e.addedAtBasis,'approved_proposal');assert.match(e.approvalReference,/vector05-20261102-v1/);
   assert.equal(e.discoveredAt,'2026-11-02');assert.equal(e.approvedAt,'2026-11-02');assert.equal(e.addedAt,'2026-11-02');
   assert.deepEqual(m.languages,a.languages);assert.equal(m.communityInterest,undefined);
   for(const [url] of a.extraSources??[])assert.ok(e.sources.some(s=>s.url===url));
   if(a.release){assert.equal(f.release.value,a.release.date??String(a.release.year));assert.equal(f.release.source,a.release.source);assert.equal(f.release.note,a.release.note);}else assert.equal(f.release,undefined);
   if(!a.repo){assert.equal(f.github.status,'not_applicable');assert.equal(f.github.stars,undefined);}
  }
  const q=scope.find(e=>e.slug==='qdrant');
  assert.equal(q.revision,old.revision+1);assert.equal(q.kind,old.kind);assert.equal(q.learningPriority,old.learningPriority);
  assert.deepEqual(q.sections.slice(0,old.sections.length),old.sections);
  assert.deepEqual(q.sections.slice(old.sections.length),qdrantCorrection.sections.map(([title,text])=>({title,text})));
  for(const s of old.sources)assert.ok(q.sources.some(t=>t.url===s.url));
  for(const slug of old.relatedSlugs)assert.ok(q.relatedSlugs.includes(slug));
  assert.equal(q.example,qdrantCorrection.example);assert.equal(q.addedAt,old.addedAt);assert.equal(q.addedAtBasis,old.addedAtBasis);
  assert.equal(q.languageSupportNote,qdrantCorrection.languageSupportNote);assert.deepEqual(after.metrics.qdrant.languages,qdrantCorrection.languages);
  assert.equal(after.facts.qdrant.release.value,'2023-02-08');assert.match(after.facts.qdrant.release.note,/אינו תאריך תחילת/);
  assert.equal(q.lifecycle,undefined);assert.equal(scope.find(e=>e.slug==='pinecone').lifecycle,undefined);
  assert.match(scope.find(e=>e.slug==='pinecone').languageSupportNote,/מאורכב/);
  assert.match(scope.find(e=>e.slug==='weaviate').sections.map(s=>s.text).join(' '),/Enterprise/);
  assert.match(scope.find(e=>e.slug==='milvus').languageSupportNote,/Milvus.Client.V2/);
  const evidence=JSON.parse(readFileSync(new URL('../database/evidence/vector-databases-2026-11-02.json',import.meta.url),'utf8'));
  for(const a of [...vectorAdditions.filter(a=>a.repo),{slug:'qdrant',repo:'qdrant/qdrant'}]){
   const e=evidence.find(e=>e.repo===a.repo),f=after.facts[a.slug];
   assert.equal(f.github.stars,e.stars);assert.equal(Date.parse(f.github.collectedAt),Date.parse(e.collectedAt));
   assert.equal(f.github.lastActivity.source,e.commitSource);assert.equal(Date.parse(f.github.lastActivity.date),Date.parse(e.commitDate));
  }
  for(const id of Object.keys(before.guides))assert.deepEqual(after.guides[id],before.guides[id]);
  assert.equal(after.guides['05'].title,vectorGuide.title);assert.deepEqual(after.guides['05'].steps.map(s=>s.slug),vectorGuide.steps.map(s=>s[0]));
  for(const slug of ['lancedb','vespa','redis','opensearch','elasticsearch','turbopuffer','sql-server','sqlite-vec','faiss'])assert.ok(!after.entries.some(e=>e.slug===slug));
  const checks=(await db.query(sql('verify_catalog.sql'))).rows;
  assert.equal(checks.find(r=>r.check_name==='entries_changed_since_import').actual,'24');
  for(const name of ['damaged_archive_documents','live_json_columns','tables_without_rls','missing_archive_guards','archive_live_foreign_keys'])assert.equal(checks.find(r=>r.check_name===name).actual,'0');
  await assert.rejects(db.exec(sql('009_add_vector_databases.sql')),/Expected schema version 8/);await db.exec('rollback');
  assert.equal((await readDatabaseCatalog(db)).entries.length,57);
 }finally{await db.close();}
});
