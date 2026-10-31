import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { assembleEntries } from "../src/data/assemble-entries.mjs";
import { assembleToolFacts, formatDate, sortTools } from "../src/data/tool-facts.mjs";
const read = name => JSON.parse(readFileSync(new URL(`../content/${name}`, import.meta.url), "utf8"));
const entries = assembleEntries(read("entries.json"), read("lessons.json"));
const data = read("tool-facts.json"), snapshots = read("github-snapshot.json");
const facts = assembleToolFacts(data, snapshots, entries);
test("all entries have concise descriptions, language notes and sourced metrics", () => {
  assert.equal(Object.keys(facts).length, entries.length);
  assert.equal(Object.values(facts).filter(f => f.github.status === "verified").length, 19);
  assert.ok(Object.values(facts).every(f => f.popularity.score === null));
});
test("first public release is not inferred from repository creation", () => {
  assert.equal(facts.mcp.release.value, "2024-11-25");
  assert.equal(facts.langchain.release, undefined);
  assert.equal(formatDate("2024-11-25"), "25/11/2024");
  assert.equal(formatDate("2024"), "2024");
});
test("unknown dates and unavailable stars remain last in both sort directions", () => {
  for (const direction of ["asc", "desc"]) {
    const sorted = sortTools(entries, facts, "release", direction);
    assert.ok(sorted.slice(0,2).every(entry => facts[entry.slug].release));
    const starsSorted = sortTools(entries, facts, "stars", direction);
    const firstUnknown = starsSorted.findIndex(entry => facts[entry.slug].github.status !== "verified");
    assert.ok(firstUnknown >= 0);
    assert.ok(starsSorted.slice(firstUnknown).every(entry => facts[entry.slug].github.status !== "verified"));
  }
});
test("Stars ordering uses numeric values and preserves input order", () => {
  const before = entries.map(entry => entry.slug);
  const sorted = sortTools(entries, facts, "stars", "desc");
  assert.equal(sorted[0].slug, "n8n");
  assert.deepEqual(entries.map(entry => entry.slug), before);
});
test("unverified metric numbers and unsupported popularity scores are rejected", () => {
  const changed = structuredClone(data);
  changed.popularity.score = 100;
  assert.throws(() => assembleToolFacts(changed, snapshots, entries), /popularity/);
  const badSnapshots = structuredClone(snapshots);
  delete badSnapshots.langchain.starsSource;
  assert.throws(() => assembleToolFacts(data, badSnapshots, entries), /snapshot/);
});
test("source dates and commit activity method are explicit", () => {
  const badSnapshots = structuredClone(snapshots);
  badSnapshots.langchain.lastActivity.method = "release_date";
  assert.throws(() => assembleToolFacts(data, badSnapshots, entries), /activity/);
  assert.equal(facts.cursor.github.status, "not_applicable");
});
