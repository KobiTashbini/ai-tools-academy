import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {readFileSync} from 'node:fs';
import {isDeepStrictEqual} from 'node:util';
import {Pool} from 'pg';
import {readDatabaseCatalog} from '../src/data/database-catalog.mjs';
import {visualAdditions,visualHistory,difyCorrection,visualGuide} from '../database/seeds/visual-builders.mjs';
const file=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
export async function verifyVisualBuilders(client,before){
 const after=await readDatabaseCatalog(client),scope=after.entries.filter(e=>e.categoryIds.includes('06'));
 assert.equal(after.entries.length,62);assert.equal(scope.length,6);
 const all=(await client.query('select document from academy.entry_documents order by slug')).rows.map(r=>r.document);
 assert.equal(all.length,64);
 for(const a of [...visualAdditions,...visualHistory]){
  const e=all.find(e=>e.slug===a.slug);assert.ok(e);assert.equal(e.publicationStatus,a.status??'published');assert.equal(e.kind,a.kind);
  assert.equal(e.revision,1);assert.equal(e.summary,a.summary);assert.equal(e.example,a.example);assert.equal(e.exercise,a.exercise);
  assert.equal(e.languageSupportNote,a.languageSupportNote);assert.equal(e.alternativesNote,a.alternativesNote);assert.equal(e.learningPriority,a.priority);
  assert.deepEqual(e.sections,a.sections.map(([title,text])=>({title,text})));assert.deepEqual(e.relatedSlugs,a.related);
  assert.equal(e.addedAt,'2026-11-03');assert.match(e.approvalReference,/visual06-20261103-v1/);
  assert.deepEqual(after.metrics[a.slug].languages,a.languages);assert.equal(after.metrics[a.slug].communityInterest,undefined);
  for(const [url] of a.sources)assert.ok(e.sources.some(s=>s.url===url));
  if(a.status==='archived'){assert.ok(!scope.some(x=>x.slug===a.slug));assert.ok(!after.entries.some(x=>x.slug===a.slug));}
 }
 const dify=scope.find(e=>e.slug==='dify');assert.equal(dify.revision,3);assert.equal(dify.example,difyCorrection.example);assert.equal(dify.exercise,difyCorrection.exercise);assert.equal(dify.languageSupportNote,difyCorrection.languageSupportNote);assert.equal(dify.alternativesNote,difyCorrection.alternativesNote);
 assert.deepEqual(after.metrics.dify.languages,difyCorrection.languages);
 const original=JSON.parse(file('research/evidence/visual06-baseline-2026-11-03.json')).scope[0].entry;
 assert.deepEqual(dify.sections.slice(0,original.sections.length),original.sections);assert.equal(dify.summary,original.summary);assert.equal(dify.kind,original.kind);assert.equal(dify.learningPriority,original.learningPriority);assert.equal(dify.addedAt,original.addedAt);assert.equal(dify.addedAtBasis,original.addedAtBasis);
 for(const source of original.sources)assert.ok(dify.sources.some(s=>isDeepStrictEqual(s,source)));
 assert.deepEqual(after.guides['06'].steps.map(s=>s.slug),visualGuide.steps.map(s=>s[0]));assert.equal(after.guides['06'].title,visualGuide.title);
 for(const e of JSON.parse(file('database/evidence/visual-builders-2026-11-03.json'))){const slug=e.canonical==='langgenius/dify'?'dify':e.canonical==='langflow-ai/langflow'?'langflow':'sim';const f=after.facts[slug];assert.equal(f.github.stars,e.stars);assert.equal(Date.parse(f.github.collectedAt),Date.parse(e.collectedAt));assert.equal(f.github.lastActivity.source,e.head.source);}
 assert.equal(after.facts.dify.release.value,'2023-05-09');assert.equal(after.facts['microsoft-copilot-studio'].release.value,'2023-11-15');
 for(const slug of ['langflow','sim','botpress'])assert.equal(after.facts[slug].release,undefined);
 for(const slug of ['microsoft-copilot-studio','botpress']){assert.equal(after.facts[slug].github.status,'not_applicable');assert.equal(after.facts[slug].github.stars,undefined);}
 const checks=(await client.query(file('database/verify_catalog.sql'))).rows;
 for(const name of ['live_json_columns','tables_without_rls','damaged_archive_documents','missing_archive_guards','archive_live_foreign_keys'])assert.equal(checks.find(r=>r.check_name===name)?.actual,'0');
 assert.equal(checks.find(r=>r.check_name==='entries_changed_since_import')?.actual,'32');
 if(before){
  assert.deepEqual(after.entries.filter(e=>!e.categoryIds.includes('06')),before.entries.filter(e=>!e.categoryIds.includes('06')));
  for(const e of before.entries.filter(e=>e.slug!=='dify')){assert.deepEqual(after.facts[e.slug],before.facts[e.slug]);assert.deepEqual(after.metrics[e.slug],before.metrics[e.slug]);}
  for(const id of Object.keys(before.guides))assert.deepEqual(after.guides[id],before.guides[id]);
 }
 return {published:after.entries.length,total:all.length,categoryPublished:scope.length,archived:visualHistory.length};
}
async function run(){
 let pool;try{
  const target=new URL(process.env.DATABASE_URL??'');if(![target.hostname,decodeURIComponent(target.username)].some(v=>v.includes('winnpnsmwkullbhrolan')))throw Error('Unexpected target');
  pool=new Pool({connectionString:process.env.DATABASE_URL,connectionTimeoutMillis:15000,statement_timeout:30000});const c=await pool.connect();
  try{
   const version=(await c.query('select max(version) version from academy.schema_migrations')).rows[0].version;if(![9,10].includes(version))throw Error('Unexpected schema version');
   let before;
   if(version===9){before=await readDatabaseCatalog(c);const baseline=JSON.parse(file('research/evidence/visual06-baseline-2026-11-03.json'));
    assert.equal(before.entries.length,baseline.identities.length);assert.deepEqual(before.entries.filter(e=>e.categoryIds.includes('06')),baseline.scope.map(s=>s.entry));
    for(const s of baseline.scope){assert.deepEqual(before.facts[s.entry.slug],s.facts);assert.deepEqual(before.metrics[s.entry.slug],s.metrics);}
    assert.equal(before.guides['06'],undefined);
    const identities=(await c.query('select e.id,e.slug,e.name,e.kind,e.publication_status,e.revision,array_agg(distinct r.url) filter(where r.url is not null) repositories from academy.entries e left join academy.repositories r on r.entry_id=e.id group by e.id order by e.slug')).rows;
    assert.deepEqual(identities,baseline.identities);
    const candidates=[...visualAdditions,...visualHistory];for(const a of candidates)if(identities.some(e=>e.slug===a.slug||e.id===a.slug||e.name.toLowerCase()===a.name.toLowerCase()))throw Error('Candidate identity collision');
    if(process.argv.includes('--check')){console.log('Read-only preflight passed: version 9; all 57 identities unchanged; Dify document/facts/metrics match reviewed baseline; no category guide.');return;}
    await c.query(file('database/010_add_visual_builders.sql'));console.log('Applied content migration 010.');
   }
   console.log(JSON.stringify(await verifyVisualBuilders(c,before)));console.log('Verified Academy visual content and archived-only historical records.');
  }finally{c.release();}
 }catch(e){console.error('Visual migration preflight/apply/verify failed ('+String(e.code??e.name??'unknown')+'); credential details omitted.');process.exitCode=1;}finally{await pool?.end();}
}
if(process.argv[1] && fileURLToPath(import.meta.url).toLowerCase() === resolve(process.argv[1]).toLowerCase()) await run();
