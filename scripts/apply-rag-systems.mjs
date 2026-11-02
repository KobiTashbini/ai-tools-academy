import {readFileSync} from 'node:fs';
import {Pool} from 'pg';
import {ragAdditions} from '../database/seeds/rag-systems.mjs';
let pool;
try{
 const target=new URL(process.env.DATABASE_URL??'');
 if(![target.hostname,decodeURIComponent(target.username)].some(v=>v.includes('winnpnsmwkullbhrolan')))throw Error('Unexpected target');
 pool=new Pool({connectionString:process.env.DATABASE_URL,connectionTimeoutMillis:10000,statement_timeout:30000});const c=await pool.connect();
 try{
  const version=(await c.query('select max(version) version from academy.schema_migrations')).rows[0].version;
  if(version===6){await c.query(readFileSync(new URL('../database/007_add_rag_systems.sql',import.meta.url),'utf8'));console.log('Applied Academy content migration 007.');}
  else if(version!==7)throw Error('Unexpected schema version');
  const rows=(await c.query(`select e.slug,e.name,e.kind,g.priority from academy.entries e join academy.entry_categories cat on cat.entry_id=e.id join academy.learning_guidance g on g.entry_id=e.id where cat.category_id='04' order by e.slug`)).rows;
  if(rows.length!==8||ragAdditions.some(a=>!rows.some(r=>r.slug===a.slug)))throw Error('Incomplete RAG category');
  const checks=(await c.query(readFileSync(new URL('../database/verify_catalog.sql',import.meta.url),'utf8'))).rows;
  for(const name of ['live_json_columns','tables_without_rls','damaged_archive_documents','missing_archive_guards','archive_live_foreign_keys'])if(checks.find(r=>r.check_name===name)?.actual!=='0')throw Error('Integrity check failed');
  if(checks.find(r=>r.check_name==='entries_changed_since_import')?.actual!=='12')throw Error('Unexpected original content edits');
  console.log(JSON.stringify(rows,null,2));console.log('Verified: eight RAG entries; archive unchanged; no live JSON or RLS gaps.');
 }finally{c.release();}
}catch{console.error('RAG migration/verification failed; check target, connection and schema. No credentials logged.');process.exitCode=1;}finally{await pool?.end();}
