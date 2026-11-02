import { Pool } from 'pg';
import { readDatabaseCatalog } from '../src/data/database-catalog.mjs';
const pool=new Pool({connectionString:process.env.DATABASE_URL,connectionTimeoutMillis:10000});
try {const c=await pool.connect();try{const d=await readDatabaseCatalog(c);console.log(JSON.stringify({categories:d.categories.length,entries:d.entries.length,facts:Object.keys(d.facts).length,guides:Object.keys(d.guides).length}));}finally{c.release();}}catch{console.error('Database catalog verification failed (connection or schema); no credentials logged.');process.exitCode=1;}finally{await pool.end();}
