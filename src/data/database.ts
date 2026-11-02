import 'server-only';
import { cache } from 'react';
import { Pool } from 'pg';
import { readDatabaseCatalog } from './database-catalog.mjs';
const state=globalThis as typeof globalThis & {academyPool?:Pool};
export const getDatabaseCatalog=cache(async()=>{
 if(!process.env.DATABASE_URL) throw Error('DATABASE_URL is required for the catalog');
 const pool=state.academyPool??=new Pool({connectionString:process.env.DATABASE_URL,max:3,connectionTimeoutMillis:10000,idleTimeoutMillis:30000,statement_timeout:15000});
 const client=await pool.connect();
 try{return await readDatabaseCatalog(client);}catch{throw Error('Unable to read the database catalog');}finally{client.release();}
});
