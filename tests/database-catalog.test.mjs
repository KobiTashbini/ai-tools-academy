import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PGlite} from '@electric-sql/pglite';
import {prepareDatabase} from '../scripts/prepare-database.mjs';
import {readDatabaseCatalog} from '../src/data/database-catalog.mjs';
import {additions} from '../database/seeds/agent-frameworks.mjs';
test('database is the runtime source for lessons, metrics and guides, including later edits',async()=>{
 const db=new PGlite();
 try{
 const seed=prepareDatabase();
 for(const name of ['001_catalog.sql']) await db.exec(readFileSync(new URL('../database/'+name,import.meta.url),'utf8'));
 await db.exec(seed.sql);
 for(const name of ['002_normalize.sql','003_merge_catalog_descriptions.sql','004_detach_archive.sql','005_developer_survey_usage.sql','006_add_agent_frameworks.sql']) await db.exec(readFileSync(new URL('../database/'+name,import.meta.url),'utf8'));
 const d=await readDatabaseCatalog(db);
 assert.equal(d.entries.length,seed.entries.length+5);assert.equal(d.categories.length,12);
 for(const e of d.entries){assert.ok(d.facts[e.slug].description);assert.ok(d.metrics[e.slug].learningReason);}
 const guidance=seed.documents.find(d=>d.path==='content/learning-guidance.json').document;
 for(const e of d.entries.filter(e=>guidance.reasons[e.slug])) assert.equal(d.metrics[e.slug].learningReason,guidance.reasons[e.slug]);
 assert.ok(d.metrics.ollama.communityInterest.score>0);
 assert.ok(d.guides['07'].steps.length>0);
 const evidence=JSON.parse(readFileSync(new URL('../database/evidence/agent-frameworks-2026-11-02.json',import.meta.url),'utf8'));
 assert.equal(d.entries.filter(e=>e.categoryIds.includes('02')).length,12);
 for(const addition of additions){
   const entry=d.entries.find(e=>e.slug===addition.slug);
   assert.ok(entry);assert.equal(d.entries.filter(e=>e.name===addition.name).length,1);
   assert.equal(entry.summary,addition.summary);assert.equal(entry.sections.length,5);
   assert.equal(entry.example,addition.example);assert.equal(entry.languageSupportNote,addition.languageSupportNote);
   assert.match(entry.languageSupportNote,/C#\/\.NET/);
   assert.equal(entry.learningPriority,addition.priority);assert.deepEqual(entry.relatedSlugs,addition.related);
   assert.equal(entry.addedAtBasis,'approved_proposal');assert.equal(entry.approvedAt,'2026-11-02');
   const f=d.facts[entry.slug],metric=d.metrics[entry.slug],snapshot=evidence.find(e=>e.repo===addition.repo);
   assert.equal(f.github.stars,snapshot.stars);assert.equal(Date.parse(f.github.lastActivity.date),Date.parse(snapshot.commitDate));
   assert.equal(f.github.lastActivity.source,snapshot.commitSource);
   assert.equal(Date.parse(f.github.collectedAt),Date.parse(snapshot.collectedAt));assert.equal(f.release.value,addition.release.date??String(addition.release.year));
   assert.equal(f.release.source,addition.release.source);assert.equal(metric.learningReason,addition.reason);
   assert.deepEqual(metric.languages,addition.languages);assert.equal(metric.communityInterest,undefined);
   assert.equal(f.popularity.score,null);
   assert.ok(entry.sources.every(s=>/^https:\/\//.test(s.url)&&s.checkedAt==='2026-11-02'));
 }
 assert.equal(d.entries.find(e=>e.slug==='microsoft-autogen').lifecycle.status,'legacy');
 assert.equal(d.entries.find(e=>e.slug==='microsoft-autogen').lifecycle.successorSlug,'microsoft-agent-framework');
 assert.equal(d.entries.filter(e=>e.lifecycle).length,1);
 assert.equal((await db.query("select count(*)::int n from academy.cohort_observations")).rows[0].n,10);
 const checks=(await db.query(readFileSync(new URL('../database/verify_catalog.sql',import.meta.url),'utf8'))).rows;
 assert.equal(checks.find(c=>c.check_name==='entries_changed_since_import').actual,'5');
 for(const name of ['live_json_columns','tables_without_rls','damaged_archive_documents','missing_archive_guards','archive_live_foreign_keys']) assert.equal(checks.find(c=>c.check_name===name).actual,'0',name);
 await assert.rejects(db.exec(readFileSync(new URL('../database/006_add_agent_frameworks.sql',import.meta.url),'utf8')),/Expected schema version 5/);
 await db.exec('rollback');
 assert.equal((await readDatabaseCatalog(db)).entries.length,seed.entries.length+additions.length);
 await db.exec('create role lifecycle_guest; grant usage on schema academy to lifecycle_guest; set role lifecycle_guest;');
 await assert.rejects(db.query('select * from academy.entry_lifecycle'),/permission denied/);
 await db.exec('reset role');
 const expectedUsage={'anthropic-claude':['Anthropic',74.6,8871],'openai-gpt':['OpenAI',74.3,8834],'google-gemini':['Google AI',54.5,6483],deepseek:['DeepSeek',18.9,2253],qwen:['Alibaba Qwen',10.1,1203],'mistral-ai':['Mistral AI',9.8,1162],'meta-llama':['Meta AI',6.3,754]};
 assert.equal(Object.values(d.metrics).filter(m=>m.surveyUsage).length,Object.keys(expectedUsage).length);
 for(const [slug,[provider,percent,count]] of Object.entries(expectedUsage)){
   const usage=d.metrics[slug].surveyUsage;
   assert.equal(usage.percent,percent);assert.equal(usage.provider,provider);assert.equal(usage.respondentCount,count);
   assert.equal(usage.year,2026);assert.equal(usage.sampleSize,11895);assert.equal(usage.multipleResponses,true);
   assert.equal(usage.source,'https://survey.stackoverflow.co/2026/technology/data/llm');
   assert.equal(usage.licenseName,'ODbL 1.0');assert.equal(usage.verifiedAt,'2026-11-02');
 }
 for(const slug of ['microsoft-foundry','openrouter','hugging-face','llm-fundamentals','amazon-bedrock','google-vertex-ai','together-ai']) assert.equal(d.metrics[slug].surveyUsage,undefined,slug);
 assert.equal(d.metrics['openai-gpt'].communityInterest,undefined);
 assert.equal(d.facts['openai-gpt'].popularity.score,null);
 await assert.rejects(db.query("update academy.entry_survey_usage set usage_percent=100.1 where entry_id='openai-gpt'"));
 await assert.rejects(db.query("update academy.entry_survey_usage set usage_percent=-0.1 where entry_id='openai-gpt'"));
 await assert.rejects(db.query("update academy.entry_survey_usage set entry_id='missing' where entry_id='openai-gpt'"));
 await db.query("update academy.entry_survey_usage set usage_percent=0 where entry_id='openai-gpt'");
 assert.equal((await readDatabaseCatalog(db)).metrics['openai-gpt'].surveyUsage.percent,0);
 const rls=(await db.query("select relname,relrowsecurity from pg_class join pg_namespace n on n.oid=relnamespace where n.nspname='academy' and relname in ('developer_surveys','entry_survey_usage')")).rows;
 assert.equal(rls.length,2);assert.ok(rls.every(r=>r.relrowsecurity));
 await db.query("update academy.entries set summary='שינוי מהמסד' where slug='mcp'");
 assert.equal((await readDatabaseCatalog(db)).entries.find(e=>e.slug==='mcp').summary,'שינוי מהמסד');
 await db.query("update academy.entries set publication_status='draft' where slug='mcp'");
 assert.ok(!(await readDatabaseCatalog(db)).entries.some(e=>e.slug==='mcp'));
 }finally{await db.close();}
});
test('database failures propagate without a file fallback',async()=>{await assert.rejects(readDatabaseCatalog({query:async()=>{throw Error('offline');}}),/offline/);});
