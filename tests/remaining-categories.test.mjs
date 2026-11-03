import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {PGlite} from '@electric-sql/pglite';
import {prepareDatabase} from '../scripts/prepare-database.mjs';
import {readDatabaseCatalog} from '../src/data/database-catalog.mjs';
import {verifyRemaining} from '../scripts/apply-remaining-categories.mjs';
import {remainingAdditions as additions,remainingGuides as guides} from '../database/seeds/remaining-categories.mjs';
import {sortAgentEntries} from '../src/data/agent-catalog.mjs';
const sql=n=>readFileSync(new URL('../database/'+n,import.meta.url),'utf8');
test('44 approved proposals preserve history and metrics, avoid aliases and keep optional tools outside central guides',async()=>{const db=new PGlite();try{
 await db.exec(sql('001_catalog.sql'));await db.exec(prepareDatabase().sql);for(const f of readdirSync(new URL('../database',import.meta.url)).filter(f=>/^0(0[2-9]|1[0-3])_.*\.sql$/.test(f)).sort())await db.exec(sql(f));const before=await readDatabaseCatalog(db),query=async s=>(await db.query(s)).rows;
 const schemaSql="select table_name,column_name,data_type from information_schema.columns where table_schema='academy' order by table_name,ordinal_position",schema=await query(schemaSql),cohorts=await query('select * from academy.cohort_observations order by cohort_id,repository_url'),snapshots=await query('select * from academy.repository_snapshots order by repository_url,collected_at');
 await db.query("update academy.entries set revision=9 where slug='codex'");await assert.rejects(db.exec(sql('014_apply_remaining_categories.sql')),/Reviewed document changed: codex/);await db.exec('rollback');await db.query("update academy.entries set revision=2 where slug='codex'");
 await db.query("insert into academy.repositories values('https://github.com/strands-agents/sdk-python','openrouter','collision')");await assert.rejects(db.exec(sql('014_apply_remaining_categories.sql')),/Strands alias already represented/);await db.exec('rollback');await db.query("delete from academy.repositories where url='https://github.com/strands-agents/sdk-python'");
 await db.exec(sql('014_apply_remaining_categories.sql'));const result=await verifyRemaining(db,before);assert.equal(result.added,26);assert.equal(result.optional,14);assert.equal(result.corrected,13);
 assert.deepEqual(await query(schemaSql),schema);assert.deepEqual(await query('select * from academy.cohort_observations order by cohort_id,repository_url'),cohorts);const current=await query('select * from academy.repository_snapshots order by repository_url,collected_at');assert.equal(current.length,snapshots.length+6);for(const s of snapshots)assert.ok(current.some(t=>JSON.stringify(t)===JSON.stringify(s)));
 const after=await readDatabaseCatalog(db);for(const id of Object.keys(guides)){const first=sortAgentEntries(after.entries.filter(e=>e.categoryIds.includes(id)&&!e.lifecycle),after.facts,after.metrics,'learningPriority','desc',guides[id].steps.map(s=>s[0]))[0];assert.equal(first.slug,guides[id].steps[0][0]);}
 const get=s=>after.entries.find(e=>e.slug===s),body=s=>get(s).sections.map(s=>s.text).join(' ');assert.match(get('devin-desktop').name,/Windsurf/);assert.equal(get('devin-desktop').lifecycle,undefined);assert.match(body('devin-desktop'),/Cascade/);assert.match(get('windmill').languageSupportNote,/C#/);assert.match(body('windmill'),/AGPL/);assert.match(body('mastra'),/Enterprise/);assert.match(get('microsoft-agent-framework').languageSupportNote,/1.27.0/);assert.match(get('temporal').languageSupportNote,/Public Preview/);assert.deepEqual(get('temporal').categoryIds,before.entries.find(e=>e.slug==='temporal').categoryIds);assert.match(body('hf-trl'),/telemetry/);
 for(const a of additions){assert.match(a.example,/שלא הורצה/);if(a.optional)assert.match(body(a.slug),/אינו חלק אוטומטי מהמסלול המרכזי/);assert.ok(a.sources.length>=2);}
 const proposals=JSON.parse(readFileSync(new URL('../research/evidence/remaining-decisions-20261103-v1.json',import.meta.url),'utf8')).proposals;const implemented=new Set([...additions.map(a=>a.proposal),...Object.values(guides).map(g=>g.proposal),...(await import('../database/seeds/remaining-categories.mjs')).remainingCorrections.map(a=>a.proposal)]);assert.equal(implemented.size,44);assert.deepEqual(proposals.filter(p=>!implemented.has(p.id)).map(p=>p.id),['C01-10','F11-08']);
 await assert.rejects(db.exec(sql('014_apply_remaining_categories.sql')),/Expected schema version 13/);await db.exec('rollback');
 await db.exec(sql('015_correct_training_library_kinds.sql'));await verifyRemaining(db,before);for(const slug of ['hf-datasets','hf-peft','torchsharp'])assert.equal((await query("select kind from academy.entries where slug='"+slug+"'"))[0].kind,'sdk');
 await assert.rejects(db.exec(sql('015_correct_training_library_kinds.sql')),/Expected schema version 14/);await db.exec('rollback');
 }finally{await db.close();}});
