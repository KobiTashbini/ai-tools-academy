import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateContent } from "../src/data/validate-content.mjs";
import { assembleEntries } from "../src/data/assemble-entries.mjs";

const categories = JSON.parse(readFileSync(new URL("../content/categories.json", import.meta.url), "utf8"));
const initialEntries = JSON.parse(readFileSync(new URL("../content/entries.json", import.meta.url), "utf8"));
const lessonData = JSON.parse(readFileSync(new URL("../content/lessons.json", import.meta.url), "utf8"));
const entries = assembleEntries(initialEntries, lessonData);
test("published content preserves all 12 categories and valid evidence", () => {
  assert.doesNotThrow(() => validateContent(categories, entries));
});
test("rejects duplicate slugs", () => {
  assert.throws(() => validateContent(categories, [...entries, { ...entries[0], id: "other" }]), /identifier/);
});
test("rejects references to nonexistent categories", () => {
  assert.throws(() => validateContent(categories, [{ ...entries[0], categoryIds: ["99"] }]), /category reference/);
});
test("verified content cannot lose its supporting sources", () => {
  assert.throws(() => validateContent(categories, [{ ...entries[0], sources: [] }]), /evidence/);
});
test("rejects executable source links", () => {
  const entry = structuredClone(entries[0]);
  entry.sources[0].url = "javascript:alert(1)";
  assert.throws(() => validateContent(categories, [entry]), /HTTPS/);
});
test("rejects impossible verification dates", () => {
  assert.throws(() => validateContent(categories, [{ ...entries[0], verifiedAt: "2026-02-30" }]), /date/);
});
test("each knowledge area has published educational content", () => {
  for (const category of categories) assert.ok(entries.some(entry => entry.publicationStatus === "published" && entry.categoryIds.includes(category.id)), category.id);
  assert.ok(entries.length >= 20);
});
test("all lessons include learning goals, depth, evidence and working related links", () => {
  for (const entry of entries) {
    assert.ok(entry.learningPriority && entry.prerequisites, entry.slug);
    assert.ok(entry.sections.length >= 5, entry.slug);
    assert.ok(entry.exercise && entry.sources.length && entry.relatedSlugs.length, entry.slug);
  }
  assert.doesNotThrow(() => validateContent(categories, entries));
});
test("rejects broken cross-lesson references", () => {
  const altered = structuredClone(entries);
  altered[0].relatedSlugs = ["nonexistent"];
  assert.throws(() => validateContent(categories, altered), /related entry reference/);
});

test('legacy entries require a valid successor and explanatory note',()=>{
 const copy=structuredClone(entries);
 copy[0].lifecycle={status:'legacy',note:'Historical entry',successorSlug:copy[1].slug};
 assert.doesNotThrow(()=>validateContent(categories,copy));
 for(const lifecycle of [{status:'legacy',note:'',successorSlug:copy[1].slug},{status:'legacy',note:'Historical',successorSlug:'missing'},{status:'legacy',note:'Historical',successorSlug:copy[0].slug}]){
  copy[0].lifecycle=lifecycle;
  assert.throws(()=>validateContent(categories,copy),/legacy successor/);
 }
});
