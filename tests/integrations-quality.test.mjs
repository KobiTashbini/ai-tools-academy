import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {PGlite} from '@electric-sql/pglite';
import {prepareDatabase} from '../scripts/prepare-database.mjs';
import {readDatabaseCatalog} from '../src/data/database-catalog.mjs';
import {verifyIntegrationsQuality} from '../scripts/apply-integrations-quality.mjs';
import {integrationsAdditions,integrationsGuides} from '../database/seeds/integrations-quality.mjs';
import {sortAgentEntries} from '../src/data/agent-catalog.mjs';
const sql=n=>readFileSync(new URL('../database/'+n,import.meta.url),'utf8');
test('approved T09/Q10 preserve Langfuse priority, learning branches, schema, historical records and old measurements',async()=>{const db=new PGlite();try{
 await db.exec(sql('001_catalog.sql'));await db.exec(prepareDatabase().sql);for(const f of readdirSync(new URL('../database',import.meta.url)).filter(f=>/^0(0[2-9]|1[0-2])_.*\.sql$/.test(f)).sort())await db.exec(sql(f));const before=await readDatabaseCatalog(db),query=async s=>(await db.query(s)).rows;
 const schemaSql="select table_name,column_name,data_type from information_schema.columns where table_schema='academy' order by table_name,ordinal_position",schema=await query(schemaSql),cohorts=await query('select * from academy.cohort_observations order by cohort_id,repository_url'),snapshots=await query('select * from academy.repository_snapshots order by repository_url,collected_at');
 await db.query("update academy.entries set revision=9 where slug='langfuse'");await assert.rejects(db.exec(sql('013_apply_integrations_quality.sql')),/Reviewed document changed: langfuse/);await db.exec('rollback');await db.query("update academy.entries set revision=2 where slug='langfuse'");
 await db.query("insert into academy.repositories values('https://github.com/modelcontextprotocol/csharp-sdk','openrouter','collision')");await assert.rejects(db.exec(sql('013_apply_integrations_quality.sql')),/Candidate repository already represented/);await db.exec('rollback');await db.query("delete from academy.repositories where url='https://github.com/modelcontextprotocol/csharp-sdk'");
 await db.exec(sql('013_apply_integrations_quality.sql'));assert.deepEqual(await verifyIntegrationsQuality(db,before),{total:86,published:84,recommended:83,category09:8,category10:9,added:15,corrected:2});
 assert.deepEqual(await query(schemaSql),schema);assert.deepEqual(await query('select * from academy.cohort_observations order by cohort_id,repository_url'),cohorts);const current=await query('select * from academy.repository_snapshots order by repository_url,collected_at');assert.equal(current.length,snapshots.length+11);for(const s of snapshots)assert.ok(current.some(t=>JSON.stringify(t)===JSON.stringify(s)));
 const after=await readDatabaseCatalog(db);for(const [id,slug] of [['09','tool-integration-fundamentals'],['10','ai-quality-security-fundamentals']])assert.equal(sortAgentEntries(after.entries.filter(e=>e.categoryIds.includes(id)),after.facts,after.metrics,'learningPriority','desc',after.guides[id].steps.map(s=>s.slug))[0].slug,slug);
 const langfuse=after.entries.find(e=>e.slug==='langfuse');assert.match(langfuse.alternativesNote,/אין חובה להשתמש דווקא/);assert.match(after.guides['10'].intro,/אין צורך לתרגל/);
 const get=s=>after.entries.find(e=>e.slug===s);assert.match(get('mcp-inspector').sections.map(s=>s.text).join(' '),/Experimental/);assert.match(get('microsoft-ai-evaluation').languageSupportNote,/Experimental/);assert.match(get('arize-phoenix').sections.map(s=>s.text).join(' '),/ELv2/);assert.match(get('opentelemetry').languageSupportNote,/Development/);assert.match(get('fastmcp').languageSupportNote,/לא אומת SDK C#/);
 for(const slug of ['composio','arize-phoenix','nemo-guardrails'])assert.equal(get(slug).learningPriority,'enrichment');for(const a of integrationsAdditions){assert.match(a.example,/שלא הורצה/);assert.ok(a.sections.some(([t])=>t.includes('יתרונות')));assert.ok(a.sections.some(([t])=>t.includes('חסרונות')));}
 for(const slug of ['deepeval','mlflow'])assert.ok(!after.entries.some(e=>e.slug===slug));await assert.rejects(db.exec(sql('013_apply_integrations_quality.sql')),/Expected schema version 12/);await db.exec('rollback');
 }finally{await db.close();}});
