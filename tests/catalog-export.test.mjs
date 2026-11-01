import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { prepareDatabase } from "../scripts/prepare-database.mjs";
import { exportCatalog } from "../src/data/catalog-export.mjs";
import { assembleToolFacts } from "../src/data/tool-facts.mjs";
import { buildAgentMetrics } from "../src/data/agent-catalog.mjs";
import { buildInferenceInterest } from "../src/data/inference-metrics.mjs";
import { validateContent } from "../src/data/validate-content.mjs";

const sql = name => readFileSync(new URL(`../database/${name}`, import.meta.url), "utf8");

async function migratedDatabase() {
  const db = new PGlite();
  const data = prepareDatabase();
  await db.exec(sql("001_catalog.sql"));
  await db.exec(data.sql);
  // Migration 002 ran in the cloud with an empty research queue and refuses a non-empty one; reproduce that state.
  await db.exec("delete from academy.research_proposals");
  for (const name of ["002_normalize.sql", "003_merge_catalog_descriptions.sql", "004_detach_archive.sql", "005_build_reader.sql"]) await db.exec(sql(name));
  return { db, data };
}
const asReader = db => async text => {
  // Every export query runs with the build reader's privileges and row policies.
  await db.exec("set role academy_build_reader");
  try { return (await db.query(text)).rows; } finally { await db.exec("reset role"); }
};

// The site's previous read model, rebuilt from the original JSON files exactly as src/data did before the switch.
function legacyReadModel(data) {
  const read = name => data.documents.find(d => d.path === `content/${name}.json`).document;
  const entries = data.entries.filter(entry => entry.publicationStatus === "published");
  const facts = assembleToolFacts(read("tool-facts"), read("github-snapshot"), entries);
  const agent = buildAgentMetrics(entries, read("category-02-presentation"), read("category-02-metric-snapshot"), read("category-02-community-interest"));
  const inference = buildInferenceInterest(read("inference-community-interest"), read("github-snapshot"));
  const reasons = read("learning-guidance").reasons, languages = read("catalog-presentation");
  const metrics = Object.fromEntries(entries.map(entry => [entry.slug, agent[entry.slug]
    ? { ...agent[entry.slug], learningReason: reasons[entry.slug] }
    : { slug: entry.slug, description: facts[entry.slug].description, languages: languages[entry.slug], learningReason: reasons[entry.slug], communityInterest: inference[entry.slug], collectedAt: facts[entry.slug].github.collectedAt ?? facts[entry.slug].popularity.collectedAt }]));
  for (const metric of Object.values(metrics)) if (metric.communityInterest === undefined) delete metric.communityInterest;
  return { categories: read("categories"), entries, facts, metrics, guides: read("category-guides"), pilotDescriptions: read("category-02-presentation") };
}
const canonical = ({ priority, source, extraSources, ...entry }) => entry;

test("database export reproduces everything the site rendered from JSON", async () => {
  const { db, data } = await migratedDatabase();
  try {
    const exported = await exportCatalog(asReader(db));
    const legacy = legacyReadModel(data);
    validateContent(exported.categories, exported.entries);

    assert.deepEqual(exported.categories, legacy.categories);
    assert.equal(exported.entries.length, 35);
    assert.deepEqual(exported.entries.map(e => e.slug).sort(), legacy.entries.map(e => e.slug).sort());
    for (const entry of legacy.entries) assert.deepEqual(exported.entries.find(e => e.slug === entry.slug), canonical(entry), entry.slug);

    for (const entry of legacy.entries) {
      const expected = { ...legacy.facts[entry.slug] };
      // Migration 003 keeps one catalog description: category 02 pilot entries use their compact wording.
      if (legacy.pilotDescriptions[entry.slug]) expected.description = legacy.pilotDescriptions[entry.slug].description;
      assert.deepEqual(exported.facts[entry.slug], expected, `facts: ${entry.slug}`);
      assert.deepEqual(exported.metrics[entry.slug], legacy.metrics[entry.slug], `metrics: ${entry.slug}`);
    }
    assert.deepEqual(exported.guides, legacy.guides);
  } finally { await db.close(); }
});

test("build reader sees published rows only and cannot read private data or write", async () => {
  const { db } = await migratedDatabase();
  try {
    const query = asReader(db);
    await db.exec("update academy.entries set publication_status='draft' where slug='qdrant'");
    const exported = await exportCatalog(query);
    assert.equal(exported.entries.length, 34);
    assert.ok(!exported.entries.some(e => e.slug === "qdrant" || e.relatedSlugs?.includes("qdrant")));
    assert.equal(exported.facts.qdrant, undefined);
    assert.equal((await query("select count(*)::int as n from academy.entry_sections where entry_id='qdrant'"))[0].n, 0);
    assert.equal((await query("select count(*)::int as n from academy.repository_snapshots s join academy.repositories r on r.url=s.repository_url where r.entry_id='qdrant'"))[0].n, 0);
    await assert.rejects(query("select * from academy.research_proposals"), /permission denied/);
    await assert.rejects(query("select * from academy.sources"), /permission denied/);
    await assert.rejects(query("select * from academy_import_archive.entries"), /permission denied/);
    await assert.rejects(query("update academy.entries set name='x' where slug='mcp'"), /permission denied/);
    await assert.rejects(query("insert into academy.categories values ('11','x','y')"), /permission denied/);
    await assert.rejects(db.exec(sql("005_build_reader.sql")), /already applied/);
    await db.exec("rollback");
  } finally { await db.close(); }
});
