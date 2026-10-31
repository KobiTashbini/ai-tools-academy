import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateContent } from "../src/data/validate-content.mjs";

const categories = JSON.parse(readFileSync(new URL("../content/categories.json", import.meta.url), "utf8"));
const entries = JSON.parse(readFileSync(new URL("../content/entries.json", import.meta.url), "utf8"));
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
