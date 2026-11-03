import {Pool} from 'pg';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {verifyRemaining} from './apply-remaining-categories.mjs';
let pool;
try{
 const target=new URL(process.env.DATABASE_URL??'');assert.ok([target.hostname,decodeURIComponent(target.username)].some(v=>v.includes('winnpnsmwkullbhrolan')));
 pool=new Pool({connectionString:process.env.DATABASE_URL,connectionTimeoutMillis:15000,statement_timeout:60000});const c=await pool.connect();
 try{const version=(await c.query('select max(version) version from academy.schema_migrations')).rows[0].version;assert.ok([14,15].includes(version));await verifyRemaining(c);
 if(version===14){await c.query(readFileSync(new URL('../database/015_correct_training_library_kinds.sql',import.meta.url),'utf8'));console.log('Applied classification correction015.');}
 console.log(JSON.stringify(await verifyRemaining(c)));
 }finally{c.release();}
}catch(e){console.error('Classification correction failed ('+String(e.code??e.name??'unknown')+'); details omitted.');process.exitCode=1;}finally{await pool?.end();}
