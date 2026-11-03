import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Pool} from 'pg';
import {readDatabaseCatalog} from '../src/data/database-catalog.mjs';
import {partitionCatalogEntries,searchableEntries,searchCatalogEntries,activeAlternatives} from '../src/data/catalog-lifecycle.mjs';
let pool;try{
 const target=new URL(process.env.DATABASE_URL??'');if(![target.hostname,decodeURIComponent(target.username)].some(v=>v.includes('winnpnsmwkullbhrolan')))throw Error('Unexpected target');
 pool=new Pool({connectionString:process.env.DATABASE_URL,connectionTimeoutMillis:15000,statement_timeout:30000});const c=await pool.connect();
 try{
  const version=(await c.query('select max(version) version from academy.schema_migrations')).rows[0].version;assert.ok([10,11].includes(version));
  const before=await readDatabaseCatalog(c);
  if(version===10){assert.equal(before.entries.length,62);assert.equal((await c.query('select count(*)::int n from academy.entries')).rows[0].n,64);assert.equal(before.entries.find(e=>e.slug==='microsoft-autogen')?.lifecycle?.status,'legacy');
   if(process.argv.includes('--check')){console.log('Preflight passed: schema 10, 64 identities, two archived visual tools and Legacy AutoGen. No writes.');}else{await c.query(readFileSync(new URL('../database/011_historical_lifecycle.sql',import.meta.url),'utf8'));console.log('Applied lifecycle migration 011.');}
  }
  if(version===11||!process.argv.includes('--check')){
   const after=await readDatabaseCatalog(c),all=searchableEntries(after),parts=partitionCatalogEntries(all);
   assert.equal(all.length,64);assert.equal(parts.active.length,61);assert.equal(parts.historical.length,3);
   assert.equal(parts.historical.find(e=>e.slug==='flowise').lifecycle.status,'discontinued');assert.equal(parts.historical.find(e=>e.slug==='openai-agent-builder').lifecycle.status,'legacy');
   for(const e of parts.historical){assert.ok(e.lifecycle.sourceUrl&&e.lifecycle.effectiveAt&&e.lifecycle.checkedAt);assert.ok(searchCatalogEntries(all,e.slug).some(x=>x.slug===e.slug));assert.ok(activeAlternatives(e,all).length);}
   if(version===10){assert.deepEqual(after.facts,before.facts);assert.deepEqual(after.metrics,before.metrics);assert.deepEqual(after.entries.filter(e=>e.slug!=='microsoft-autogen'),before.entries.filter(e=>e.slug!=='microsoft-autogen'));}
   console.log('Verified: 61 active recommendations, 3 discoverable historical records; no draft or unclassified archive exposure.');
  }
 }finally{c.release();}
}catch(e){console.error('Lifecycle migration check/apply failed ('+String(e.code??e.name??'unknown')+'); details omitted.');process.exitCode=1;}finally{await pool?.end();}
