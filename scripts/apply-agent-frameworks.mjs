import {readFileSync} from 'node:fs';
import {Pool} from 'pg';
import {additions} from '../database/seeds/agent-frameworks.mjs';
let pool;
try {
 const target=new URL(process.env.DATABASE_URL??'');
 if(![target.hostname,decodeURIComponent(target.username)].some(v=>v.includes('winnpnsmwkullbhrolan'))) throw Error('Unexpected target');
 pool=new Pool({connectionString:process.env.DATABASE_URL,connectionTimeoutMillis:10000,statement_timeout:30000});
 const client=await pool.connect();
 try {
  const version=(await client.query('select max(version) version from academy.schema_migrations')).rows[0].version;
  if(version===5){await client.query(readFileSync(new URL('../database/006_add_agent_frameworks.sql',import.meta.url),'utf8'));console.log('Applied Academy migration 006.');}
  else if(version!==6) throw Error('Unexpected schema version');
  const rows=(await client.query(`select e.slug,e.name,g.priority,r.stars,r.last_activity_at,l.status from academy.entries e
   join academy.learning_guidance g on g.entry_id=e.id join academy.repositories repo on repo.entry_id=e.id
   join academy.repository_snapshots r on r.repository_url=repo.url left join academy.entry_lifecycle l on l.entry_id=e.id
   where e.slug=any($1::text[]) order by e.slug`,[additions.map(a=>a.slug)])).rows;
  if(rows.length!==5)throw Error('Incomplete additions');
  console.log(JSON.stringify(rows,null,2));
  const checks=(await client.query(readFileSync(new URL('../database/verify_catalog.sql',import.meta.url),'utf8'))).rows;
  for(const name of ['live_json_columns','tables_without_rls','damaged_archive_documents','missing_archive_guards','archive_live_foreign_keys']) {
    if(checks.find(c=>c.check_name===name)?.actual!=='0')throw Error('Catalog integrity check failed');
  }
  if(checks.find(c=>c.check_name==='entries_changed_since_import')?.actual!=='5')throw Error('Unexpected historical content changes');
  console.log('Integrity verified: 5 approved additions; original archive unchanged; RLS enabled; no live JSON columns.');
 }finally{client.release();}
}catch{console.error('Framework migration/verification failed; connection, target or schema must be checked. No credentials logged.');process.exitCode=1;}
finally{await pool?.end();}
