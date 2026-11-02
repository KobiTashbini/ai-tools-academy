import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PGlite} from '@electric-sql/pglite';
import {prepareDatabase} from '../scripts/prepare-database.mjs';
import {readDatabaseCatalog} from '../src/data/database-catalog.mjs';
test('database is the runtime source for lessons, metrics and guides, including later edits',async()=>{
 const db=new PGlite();
 try{
 const seed=prepareDatabase();
 for(const name of ['001_catalog.sql']) await db.exec(readFileSync(new URL('../database/'+name,import.meta.url),'utf8'));
 await db.exec(seed.sql);
 for(const name of ['002_normalize.sql','003_merge_catalog_descriptions.sql','004_detach_archive.sql']) await db.exec(readFileSync(new URL('../database/'+name,import.meta.url),'utf8'));
 const d=await readDatabaseCatalog(db);
 assert.equal(d.entries.length,35);assert.equal(d.categories.length,12);
 for(const e of d.entries){assert.ok(d.facts[e.slug].description);assert.ok(d.metrics[e.slug].learningReason);}
 const guidance=seed.documents.find(d=>d.path==='content/learning-guidance.json').document;
 for(const e of d.entries) assert.equal(d.metrics[e.slug].learningReason,guidance.reasons[e.slug]);
 assert.ok(d.metrics.ollama.communityInterest.score>0);
 assert.ok(d.guides['07'].steps.length>0);
 await db.query("update academy.entries set summary='שינוי מהמסד' where slug='mcp'");
 assert.equal((await readDatabaseCatalog(db)).entries.find(e=>e.slug==='mcp').summary,'שינוי מהמסד');
 await db.query("update academy.entries set publication_status='draft' where slug='mcp'");
 assert.ok(!(await readDatabaseCatalog(db)).entries.some(e=>e.slug==='mcp'));
 }finally{await db.close();}
});
test('database failures propagate without a file fallback',async()=>{await assert.rejects(readDatabaseCatalog({query:async()=>{throw Error('offline');}}),/offline/);});
