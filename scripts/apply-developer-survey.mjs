// Narrow, explicit migration runner for the existing Academy Supabase project.
// Credentials are read from the environment and never printed.
import {readFileSync} from 'node:fs';
import {Pool} from 'pg';
const project='winnpnsmwkullbhrolan';
let pool;
try {
  const url=new URL(process.env.DATABASE_URL??'');
  if(![url.hostname,decodeURIComponent(url.username)].some(value=>value.includes(project))) throw Error('Unexpected database target');
  pool=new Pool({connectionString:process.env.DATABASE_URL,connectionTimeoutMillis:10000,statement_timeout:30000});
  const client=await pool.connect();
  try {
    const versions=(await client.query('select max(version) version from academy.schema_migrations')).rows[0];
    if(versions.version===4) {
      await client.query(readFileSync(new URL('../database/005_developer_survey_usage.sql',import.meta.url),'utf8'));
      console.log('Applied Academy migration 005.');
    }else if(versions.version!==5) throw Error('Unexpected schema version');
    const rows=(await client.query(`select e.slug,u.provider_name,u.usage_percent,s.survey_year,s.sample_size,s.source_url
      from academy.entry_survey_usage u join academy.entries e on e.id=u.entry_id
      join academy.developer_surveys s on s.id=u.survey_id where s.id='so_2026_llm_all' order by u.usage_percent desc`)).rows;
    if(rows.length!==7) throw Error('Incomplete survey data');
    console.log(JSON.stringify(rows,null,2));
  }finally{client.release();}
}catch{
  console.error('Survey migration/verification failed; target, connection or schema must be checked. No credentials logged.');
  process.exitCode=1;
}finally{await pool?.end();}
