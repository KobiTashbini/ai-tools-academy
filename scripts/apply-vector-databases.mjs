import {readFileSync} from 'node:fs';
import {isDeepStrictEqual} from 'node:util';
import {Pool} from 'pg';
import {readDatabaseCatalog} from '../src/data/database-catalog.mjs';
import {vectorAdditions,qdrantCorrection} from '../database/seeds/vector-databases.mjs';
let pool;
try{
 const target=new URL(process.env.DATABASE_URL??'');
 if(![target.hostname,decodeURIComponent(target.username)].some(v=>v.includes('winnpnsmwkullbhrolan')))throw Error('Unexpected target');
 pool=new Pool({connectionString:process.env.DATABASE_URL,connectionTimeoutMillis:10000,statement_timeout:30000});
 const c=await pool.connect();
 try{
  const version=(await c.query('select max(version) version from academy.schema_migrations')).rows[0].version;
  if(![8,9].includes(version))throw Error('Unexpected schema version');
  let before;
  if(version===8){
   before=await readDatabaseCatalog(c);
   const baseline=JSON.parse(readFileSync(new URL('../research/evidence/vector05-baseline-2026-11-02.json',import.meta.url),'utf8'));
   await c.query('begin isolation level repeatable read read only');
   const all=(await c.query('select document from academy.entry_documents order by slug')).rows.map(r=>r.document);
   await c.query('commit');
   if(all.length!==baseline.total||!isDeepStrictEqual(all.filter(e=>e.categoryIds.includes('05')),baseline.scope))throw Error('Catalog drift; research baseline needs reconciliation');
   for(const a of vectorAdditions){if(all.some(e=>e.slug===a.slug||e.name.toLowerCase()===a.name.toLowerCase()))throw Error('Duplicate identity');}
   if(process.argv.includes('--check')){console.log('Read-only preflight passed: version 8, 50 entries, Qdrant revision 2 matches reviewed document; no candidate identity duplicates.');}
   else {await c.query(readFileSync(new URL('../database/009_add_vector_databases.sql',import.meta.url),'utf8'));console.log('Applied Academy content migration 009.');}
  }
  if(version===9||!process.argv.includes('--check')){
   const after=await readDatabaseCatalog(c),scope=after.entries.filter(e=>e.categoryIds.includes('05'));
   if(scope.length!==8||after.entries.length!==57||vectorAdditions.some(a=>!scope.some(e=>e.slug===a.slug)))throw Error('Incomplete vector additions');
   const qdrant=scope.find(e=>e.slug==='qdrant');
   if(qdrant.revision!==3||qdrant.example!==qdrantCorrection.example)throw Error('Qdrant correction incomplete');
   if(before&&!isDeepStrictEqual(before.entries.filter(e=>e.slug!=='qdrant'),after.entries.filter(e=>e.slug!=='qdrant'&&!vectorAdditions.some(a=>a.slug===e.slug))))throw Error('Unrelated content changed');
   const checks=(await c.query(readFileSync(new URL('../database/verify_catalog.sql',import.meta.url),'utf8'))).rows;
   for(const name of ['live_json_columns','tables_without_rls','damaged_archive_documents','missing_archive_guards','archive_live_foreign_keys'])if(checks.find(r=>r.check_name===name)?.actual!=='0')throw Error('Integrity check failed');
   if(checks.find(r=>r.check_name==='entries_changed_since_import')?.actual!=='24')throw Error('Unexpected archive delta');
   console.log(JSON.stringify(scope.map(e=>({slug:e.slug,kind:e.kind,priority:e.learningPriority,revision:e.revision,stars:after.facts[e.slug].github.stars??null})),null,2));
   console.log('Verified: 57 published entries, eight in category 05; original archive intact.');
  }
 }finally{c.release();}
}catch(error){console.error('Vector migration check/apply failed ('+(error.code??'baseline or integrity mismatch')+'); credentials omitted.');process.exitCode=1;}
finally{await pool?.end();}
