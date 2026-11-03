import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PGlite} from '@electric-sql/pglite';
import {prepareDatabase} from '../scripts/prepare-database.mjs';
import {readDatabaseCatalog} from '../src/data/database-catalog.mjs';
import {verifyVisualBuilders} from '../scripts/apply-visual-builders.mjs';
import {sortAgentEntries} from '../src/data/agent-catalog.mjs';
const sql=name=>readFileSync(new URL('../database/'+name,import.meta.url),'utf8');
test('approved visual builders preserve prior content, add practical lessons and hide historical tools without schema changes',async()=>{
 const db=new PGlite();try{
 await db.exec(sql('001_catalog.sql'));await db.exec(prepareDatabase().sql);
 for(const f of ['002_normalize.sql','003_merge_catalog_descriptions.sql','004_detach_archive.sql','005_developer_survey_usage.sql','006_add_agent_frameworks.sql','007_add_rag_systems.sql','008_apply_rag_review.sql','009_add_vector_databases.sql'])await db.exec(sql(f));
 const before=await readDatabaseCatalog(db);
 const columns=async()=>(await db.query("select table_name,column_name,data_type from information_schema.columns where table_schema='academy' order by table_name,ordinal_position")).rows;
 const schema=await columns(),cohorts=(await db.query('select * from academy.cohort_observations order by cohort_id,repository_url')).rows;
 const oldSnapshots=(await db.query('select * from academy.repository_snapshots order by repository_url,collected_at')).rows;
 await db.query("update academy.entries set revision=3 where slug='dify'");await assert.rejects(db.exec(sql('010_add_visual_builders.sql')),/Reviewed Dify document changed/);await db.exec('rollback');await db.query("update academy.entries set revision=2 where slug='dify'");
 await db.query("insert into academy.repositories values('https://github.com/langflow-ai/langflow','openrouter','collision')");await assert.rejects(db.exec(sql('010_add_visual_builders.sql')),/Candidate repository already represented/);await db.exec('rollback');await db.query("delete from academy.repositories where url='https://github.com/langflow-ai/langflow'");
 await db.exec(sql('010_add_visual_builders.sql'));
 assert.deepEqual(await verifyVisualBuilders(db,before),{published:62,total:64,categoryPublished:6,archived:2});
 const after=await readDatabaseCatalog(db);assert.deepEqual(await columns(),schema);assert.deepEqual((await db.query('select * from academy.cohort_observations order by cohort_id,repository_url')).rows,cohorts);
 const snapshots=(await db.query('select * from academy.repository_snapshots order by repository_url,collected_at')).rows;assert.equal(snapshots.length,oldSnapshots.length+3);for(const s of oldSnapshots)assert.ok(snapshots.some(t=>JSON.stringify(s)===JSON.stringify(t)));
 const scope=after.entries.filter(e=>e.categoryIds.includes('06'));assert.deepEqual(sortAgentEntries(scope,after.facts,after.metrics,'learningPriority','desc',after.guides['06'].steps.map(s=>s.slug)).map(e=>e.slug),['visual-ai-builders-fundamentals','dify','langflow','microsoft-copilot-studio','sim','botpress']);
 assert.equal(after.entries.filter(e=>e.lifecycle).length,before.entries.filter(e=>e.lifecycle).length);assert.equal((await db.query("select count(*)::int n from academy.entry_lifecycle where entry_id in ('flowise','openai-agent-builder')")).rows[0].n,0);
 for(const e of scope.filter(e=>e.kind!=='concept')){assert.match(e.example,/שלא הורצה/);assert.ok(e.sections.some(s=>s.title.includes('יתרונות')));assert.ok(e.sections.some(s=>s.title.includes('חסרונות')));assert.ok(e.sections.some(s=>s.title.includes('השוואה')));assert.ok(e.alternativesNote.length>50);}
 for(const slug of ['voiceflow','fastgpt','coze-studio'])assert.ok(!after.entries.some(e=>e.slug===slug));
 await assert.rejects(db.exec(sql('010_add_visual_builders.sql')),/Expected schema version 9/);await db.exec('rollback');assert.equal((await readDatabaseCatalog(db)).entries.length,62);
 }finally{await db.close();}
});
