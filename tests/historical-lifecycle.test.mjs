import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PGlite} from '@electric-sql/pglite';
import {prepareDatabase} from '../scripts/prepare-database.mjs';
import {readDatabaseCatalog} from '../src/data/database-catalog.mjs';
import {partitionCatalogEntries,searchableEntries,searchCatalogEntries,activeAlternatives} from '../src/data/catalog-lifecycle.mjs';
const sql=n=>readFileSync(new URL('../database/'+n,import.meta.url),'utf8');
test('all lifecycle states are separated from recommendations and searchable; drafts/unclassified archives never surface',()=>{
 const records=[{slug:'active',name:'Active',kind:'platform',summary:'tool',publicationStatus:'published'},{slug:'legacy',name:'Old',summary:'old',publicationStatus:'published',lifecycle:{status:'legacy'},relatedSlugs:['active','draft']},{slug:'maintenance',name:'Maintenance',summary:'maintained',publicationStatus:'published',lifecycle:{status:'maintenance'}},{slug:'stopped',name:'Stopped',summary:'historical',publicationStatus:'archived',lifecycle:{status:'discontinued'}},{slug:'draft',name:'Secret',summary:'draft',publicationStatus:'draft'},{slug:'archive',name:'Other',summary:'private archive',publicationStatus:'archived'}];
 const p=partitionCatalogEntries(records);assert.deepEqual(p.active.map(e=>e.slug),['active']);assert.deepEqual(p.historical.map(e=>e.slug),['legacy','maintenance','stopped']);
 assert.equal(searchCatalogEntries(records,'secret').length,0);assert.equal(searchCatalogEntries(records,'Other').length,0);assert.equal(searchCatalogEntries(records,'STOPPED')[0].slug,'stopped');assert.equal(searchCatalogEntries(records,'').length,0);assert.deepEqual(activeAlternatives(records[1],records).map(e=>e.slug),['active']);
});
test('lifecycle migration exposes verified historical pages without changing publication, content, facts or metrics',async()=>{
 const db=new PGlite();try{
 await db.exec(sql('001_catalog.sql'));await db.exec(prepareDatabase().sql);
 for(const f of ['002_normalize.sql','003_merge_catalog_descriptions.sql','004_detach_archive.sql','005_developer_survey_usage.sql','006_add_agent_frameworks.sql','007_add_rag_systems.sql','008_apply_rag_review.sql','009_add_vector_databases.sql','010_add_visual_builders.sql'])await db.exec(sql(f));
 const before=await readDatabaseCatalog(db),documents=(await db.query('select document from academy.entry_documents order by slug')).rows;
 await db.exec(sql('011_historical_lifecycle.sql'));
 const after=await readDatabaseCatalog(db),all=searchableEntries(after),parts=partitionCatalogEntries(all);
 assert.equal(parts.active.length,61);assert.equal(parts.historical.length,3);assert.equal(all.length,64);assert.deepEqual((await db.query('select document from academy.entry_documents order by slug')).rows,documents);assert.deepEqual(after.facts,before.facts);assert.deepEqual(after.metrics,before.metrics);
 assert.equal(parts.active.filter(e=>e.categoryIds.includes('02')).length,11);assert.equal(parts.historical.filter(e=>e.categoryIds.includes('02')).length,1);assert.equal(parts.active.filter(e=>e.categoryIds.includes('06')).length,6);assert.equal(parts.historical.filter(e=>e.categoryIds.includes('06')).length,2);
 for(const e of parts.historical){assert.ok(e.lifecycle.sourceUrl.startsWith('https://'));assert.ok(e.lifecycle.checkedAt);assert.ok(e.lifecycle.effectiveAt);assert.ok(activeAlternatives(e,all).length);assert.ok(searchCatalogEntries(all,e.slug).some(x=>x.slug===e.slug));}
 const flowise=parts.historical.find(e=>e.slug==='flowise');assert.equal(flowise.lifecycle.status,'discontinued');assert.equal(flowise.lifecycle.effectiveAt,'2026-08-31');assert.equal(flowise.lifecycle.successorSlug,undefined);
 const builder=parts.historical.find(e=>e.slug==='openai-agent-builder');assert.equal(builder.lifecycle.status,'legacy');assert.equal(builder.lifecycle.scheduledEndAt,'2026-11-30');
 await assert.rejects(db.query("update academy.entry_lifecycle set source_url=null where entry_id='flowise'"),/check constraint/);
 await db.query("update academy.entry_lifecycle set status='maintenance' where entry_id='flowise'");assert.equal((await readDatabaseCatalog(db)).historicalEntries.find(e=>e.slug==='flowise').lifecycle.status,'maintenance');await db.query("update academy.entry_lifecycle set status='discontinued' where entry_id='flowise'");
 const checks=(await db.query(sql('verify_catalog.sql'))).rows;for(const name of ['live_json_columns','tables_without_rls','damaged_archive_documents','missing_archive_guards','archive_live_foreign_keys'])assert.equal(checks.find(r=>r.check_name===name).actual,'0');
 await assert.rejects(db.exec(sql('011_historical_lifecycle.sql')),/Expected schema version 10/);await db.exec('rollback');
 }finally{await db.close();}
});
