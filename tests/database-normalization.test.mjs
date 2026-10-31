import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { prepareDatabase } from '../scripts/prepare-database.mjs';

const sql = name => readFileSync(new URL(`../database/${name}`,import.meta.url),'utf8');
async function fixture() {
  const db = new PGlite();
  const data = prepareDatabase();
  await db.exec(sql('001_catalog.sql'));
  await db.exec(data.sql);
  return {db,data};
}
const canonical = e => {
  const {priority,source,extraSources,...result} = e;
  return result;
};

test('normalization preserves all lessons, evidence, guides and metric observations with no live JSON columns', async () => {
  const {db,data}=await fixture();
  const read = path => data.documents.find(d=>d.path===`content/${path}.json`).document;
  try {
    await db.exec(sql('002_normalize.sql'));
    await db.exec(sql('003_merge_catalog_descriptions.sql'));
    await db.exec(sql('004_detach_archive.sql'));
    const rows=(await db.query('select id,document from academy.entry_documents')).rows;
    assert.equal(rows.length,data.entries.length);
    for(const e of data.entries) assert.deepEqual(rows.find(r=>r.id===e.id).document,canonical(e));
    const jsonColumns=(await db.query("select column_name from information_schema.columns c join information_schema.tables t using(table_catalog,table_schema,table_name) where c.table_schema='academy' and t.table_type='BASE TABLE' and c.data_type in ('json','jsonb')")).rows;
    assert.deepEqual(jsonColumns,[]);
    const archiveDependencies=(await db.query("select c.conname from pg_constraint c join pg_class child on child.oid=c.conrelid join pg_namespace cn on cn.oid=child.relnamespace join pg_class parent on parent.oid=c.confrelid join pg_namespace pn on pn.oid=parent.relnamespace where c.contype='f' and cn.nspname='academy_import_archive' and pn.nspname='academy'")).rows;
    assert.deepEqual(archiveDependencies,[]);
    const sources=(await db.query('select * from academy.entry_sources')).rows;
    assert.equal(sources.length,data.entries.reduce((n,e)=>n+e.sources.length,0));
    const facts=(await db.query('select e.slug,f.* from academy.catalog_facts f join academy.entries e on e.id=f.entry_id')).rows;
    assert.equal(facts.length,data.entries.length);
    for(const [slug,f] of Object.entries(read('tool-facts').entries)) {
      const row=facts.find(r=>r.slug===slug);
      assert.equal(row.description,read('category-02-presentation')[slug]?.description??f.description);
      assert.equal(row.language_support_summary,f.languages);
      assert.equal(row.repository_note,f.github?.scope??null);
    }
    const snapshots=(await db.query('select * from academy.repository_snapshots')).rows;
    for(const r of Object.values(read('github-snapshot'))) {
      const row=snapshots.find(s=>s.repository_url===r.url&&new Date(s.collected_at).toISOString()===new Date(r.collectedAt).toISOString());
      assert.equal(Number(row.stars),r.stars);
      if(r.forks!==undefined) assert.equal(Number(row.forks),r.forks);
      assert.equal(row.branch,r.lastActivity.branch);
      assert.equal(row.activity_source_url,r.lastActivity.source);
    }
    const observations=(await db.query('select o.*,s.stars,s.forks from academy.cohort_observations o join academy.repository_snapshots s using(repository_url,collected_at)')).rows;
    for(const name of ['category-02-community-interest','inference-community-interest']) for(const r of read(name).entries) {
      const row=observations.find(o=>o.cohort_id===read(name).cohort&&o.repository_url===r.repository);
      assert.equal(Number(row.stars),r.stars); assert.equal(Number(row.forks),r.forks);
    }
    assert.equal(observations.length,10);
    const guides=(await db.query('select * from academy.category_guides')).rows;
    const steps=(await db.query('select s.*,e.slug from academy.category_guide_steps s join academy.entries e on e.id=s.entry_id order by position')).rows;
    for(const [id,g] of Object.entries(read('category-guides'))) {
      const row=guides.find(r=>r.category_id===id);
      assert.equal(row.title,g.title); assert.equal(row.introduction,g.intro);assert.equal(row.note,g.note);
      assert.deepEqual(steps.filter(s=>s.category_id===id).map(s=>({text:s.instruction,slug:s.slug,label:s.link_label})),g.steps);
    }
    const releases=(await db.query('select r.*,e.slug from academy.entry_releases r join academy.entries e on e.id=r.entry_id')).rows;
    for(const [slug,f] of Object.entries(read('tool-facts').entries)) if(f.release) {
      const row=releases.find(r=>r.slug===slug);
      assert.equal(row.precision,f.release.precision); assert.equal(row.source_url,f.release.source);
      assert.equal(row.note,f.release.note);
      assert.equal(row.release_date?new Date(row.release_date).toISOString().slice(0,10):String(row.release_year),f.release.value);
    }
    const ranks=(await db.query("select e.slug,m.* from academy.package_metrics m join academy.entries e on e.id=m.entry_id where method_id='source_rank'")).rows;
    for(const rank of read('category-02-metric-snapshot').sourceRank) {
      const row=ranks.find(r=>r.slug===rank.slug);
      assert.equal(row.value===null?null:Number(row.value),rank.rank??null);
      assert.equal(row.request_status,String(rank.status));
      assert.equal(row.reason,rank.reason??null);
    }
    const archive=(await db.query('select path,raw_text from academy_import_archive.source_documents')).rows;
    for(const d of data.documents) assert.equal(archive.find(r=>r.path===d.path).raw_text,d.raw);
    await assert.rejects(db.exec("update academy_import_archive.entries set name='changed' where id='mcp'"),/read-only/);
    await assert.rejects(db.exec("truncate academy_import_archive.research_proposals"),/read-only/);
    await db.exec("update academy.entries set name='New MCP name' where id='mcp'");
    assert.equal((await db.query("select document->>'name' as name from academy.entry_documents where id='mcp'")).rows[0].name,'New MCP name');
    await assert.rejects(db.exec(sql('rollback_002.sql')),/Live content changed/);
    await db.exec('rollback');
    await db.exec("update academy.entries set name='MCP' where id='mcp'");
    await db.exec('create role catalog_untrusted; set role catalog_untrusted');
    await assert.rejects(db.query('select * from academy.catalog'),/permission denied/);
    await db.exec('reset role');
    const rls=(await db.query("select relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='academy' and relkind='r'")).rows;
    assert.ok(rls.length>0&&rls.every(r=>r.relrowsecurity));
    await assert.rejects(db.exec("insert into academy.entry_categories values('mcp','99',1)"),/foreign key/);
    await assert.rejects(db.exec(sql('002_normalize.sql')),/archive exists/);
    await db.exec('rollback');
    await db.exec(sql('rollback_002.sql'));
    assert.equal((await db.query('select count(*)::int as n from academy.entries')).rows[0].n,35);
    await db.exec("update academy.entries set name='MCP' where id='mcp'");
  } finally {await db.close();}
});

test('unmapped fields abort normalization without replacing the working schema', async()=>{
  const {db}=await fixture();
  try {
    await db.exec("update academy.entries set payload=payload||'{\"unmappedField\":true}'::jsonb where id='mcp'");
    await assert.rejects(db.exec(sql('002_normalize.sql')),/Unmapped entry field/);
    await db.exec('rollback');
    assert.equal((await db.query('select count(*)::int as n from academy.entries')).rows[0].n,35);
    assert.equal((await db.query("select count(*)::int as n from information_schema.schemata where schema_name='academy_import_archive'")).rows[0].n,0);
  } finally {await db.close();}
});
