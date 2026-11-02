import {readFileSync} from 'node:fs';
import {Pool} from 'pg';
import {readDatabaseCatalog} from '../src/data/database-catalog.mjs';
import {reviewAdditions,reviewCorrections} from '../database/seeds/rag-review.mjs';
let pool;
try {
 const target=new URL(process.env.DATABASE_URL??'');
 if(![target.hostname,decodeURIComponent(target.username)].some(v=>v.includes('winnpnsmwkullbhrolan')))throw Error('Unexpected target');
 pool=new Pool({connectionString:process.env.DATABASE_URL,connectionTimeoutMillis:10000,statement_timeout:30000});
 const c=await pool.connect();
 try {
  const version=(await c.query('select max(version) version from academy.schema_migrations')).rows[0].version;
  let before;
  if(version===7){before=await readDatabaseCatalog(c);await c.query(readFileSync(new URL('../database/008_apply_rag_review.sql',import.meta.url),'utf8'));console.log('Applied Academy content migration 008.');}
  else if(version!==8)throw Error('Unexpected schema version');
  const after=await readDatabaseCatalog(c),rag=after.entries.filter(e=>e.categoryIds.includes('04'));
  if(rag.length!==11||after.entries.length!==50||reviewAdditions.some(a=>!rag.some(e=>e.slug===a.slug)))throw Error('Incomplete review');
  for(const a of reviewCorrections){const e=rag.find(e=>e.slug===a.slug);if(e.revision!==(a.slug==='llamaindex'?3:2))throw Error('Correction revision mismatch');}
  if(before){const prior=before.entries.filter(e=>!e.categoryIds.includes('04'));const remaining=after.entries.filter(e=>!e.categoryIds.includes('04'));if(JSON.stringify(prior)!==JSON.stringify(remaining))throw Error('Unrelated content changed');}
  const checks=(await c.query(readFileSync(new URL('../database/verify_catalog.sql',import.meta.url),'utf8'))).rows;
  for(const name of ['live_json_columns','tables_without_rls','damaged_archive_documents','missing_archive_guards','archive_live_foreign_keys'])if(checks.find(r=>r.check_name===name)?.actual!=='0')throw Error('Integrity check failed');
  if(checks.find(r=>r.check_name==='entries_changed_since_import')?.actual!=='16')throw Error('Unexpected archive delta');
  console.log(JSON.stringify(rag.map(e=>({slug:e.slug,kind:e.kind,revision:e.revision,release:after.facts[e.slug].release?.value??null,stars:after.facts[e.slug].github.stars??null})),null,2));
  console.log('Verified: 50 published entries, 11 RAG entries, eight corrections; original archive intact.');
 }finally{c.release();}
}catch {console.error('RAG review apply/verification failed; check target, revisions or connection. No credentials logged.');process.exitCode=1;}
finally{await pool?.end();}
