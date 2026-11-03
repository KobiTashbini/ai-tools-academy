import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {Pool} from 'pg';
import {readDatabaseCatalog} from '../../src/data/database-catalog.mjs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const baseline=read('research/evidence/integrations0910-baseline-2026-11-03.json');
const results=[];
for(const [id,file,count] of [['T09','integrations09',9],['Q10','quality10',10]]){
 const report=readFileSync('research/runs/2026-11-03-'+file+'-v1.md','utf8');
 const ids=[...report.matchAll(new RegExp('^\\| ('+id+'-\\d{2}) \\|','gm'))].map(m=>m[1]);
 assert.equal(ids.length,count);assert.equal(new Set(ids).size,count);
 assert.ok(report.includes('pending_review')&&report.includes('approval:null'));
 for(const link of report.matchAll(/\]\((\.\.\/evidence\/[^)]+)\)/g))assert.ok(existsSync('research/runs/'+link[1]));
 const evidence=read('research/evidence/'+file+'-20261103-v1-sources.json');
 assert.equal(evidence.status,'pending_review');assert.equal(evidence.approval,null);assert.ok(evidence.claims.length>10);
 for(const claim of evidence.claims){assert.equal(new URL(claim.url).protocol,'https:');assert.ok(Number.isFinite(Date.parse(claim.checkedAt)));assert.ok(['high','medium','low'].includes(claim.confidence));}
 results.push({reportId:file+'-20261103-v1',proposalIds:ids,claims:evidence.claims.length});
}
const snapshots=[...read('research/evidence/integrations0910-github-2026-11-03.json').repositories,...read('research/evidence/integrations0910-otel-github-2026-11-03.json').repositories];
assert.equal(snapshots.length,14);assert.equal(new Set(snapshots.map(r=>r.canonical.toLowerCase())).size,14);
for(const r of snapshots){assert.ok(Number.isInteger(r.stars)&&Number.isInteger(r.forks));assert.ok(r.head.sha&&r.head.source);assert.ok(Number.isFinite(Date.parse(r.collectedAt)));}
let pool;
try{
 pool=new Pool({connectionString:process.env.DATABASE_URL,connectionTimeoutMillis:15000,statement_timeout:30000});const c=await pool.connect();try{
 const data=await readDatabaseCatalog(c);for(const s of baseline.scope){assert.deepEqual(data.entries.find(e=>e.slug===s.entry.slug),s.entry);assert.deepEqual(data.facts[s.entry.slug],s.facts);assert.deepEqual(data.metrics[s.entry.slug],s.metrics);}for(const [id,g] of Object.entries(baseline.guides))assert.deepEqual(data.guides[id]??null,g);
 await c.query('begin isolation level repeatable read read only');
 const identities=(await c.query('select e.id,e.slug,e.name,e.kind,e.publication_status,e.revision,array_agg(distinct r.url) filter(where r.url is not null) repositories from academy.entries e left join academy.repositories r on r.entry_id=e.id group by e.id order by e.slug')).rows;
 const proposals=(await c.query('select * from academy.research_proposals')).rows;await c.query('commit');assert.deepEqual(identities,baseline.identities);assert.deepEqual(proposals,baseline.proposals);
 }finally{c.release();}
 const checkedAt=new Date().toISOString();const audit={checkedAt,baselineAt:baseline.checkedAt,baselineIdentities:71,inScopeChecked:2,inScopeTotal:2,reports:results,repositoryMeasurements:snapshots.length,livePostflight:'71 identities and revisions, both reviewed documents/facts/metrics, guides and proposal rows unchanged',queue:'unchanged; report-only proposals; legacy validator not evidence of live coverage',catalogWrites:false,codeChanges:false,commit:false,push:false,deployment:false};
 writeFileSync('research/evidence/integrations0910-validation-2026-11-03.json',JSON.stringify(audit,null,2)+'\n');console.log(JSON.stringify(audit));
}catch(e){console.error('Research validation failed ('+String(e.code??e.name??'unknown')+'); credential and assertion details omitted.');process.exitCode=1;}finally{await pool?.end();}
