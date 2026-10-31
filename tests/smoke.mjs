import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { assembleEntries } from "../src/data/assemble-entries.mjs";

const base = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3000";
const readJson = file => JSON.parse(readFileSync(new URL(`../content/${file}`, import.meta.url), "utf8"));
const entries = assembleEntries(readJson("entries.json"), readJson("lessons.json")).filter(entry => entry.publicationStatus === "published");
const routes = ["/", "/atlas", ...Array.from({ length: 12 }, (_, i) => `/atlas/${String(i).padStart(2, "0")}`), ...entries.map(entry => `/tools/${entry.slug}`)];
for (const route of routes) {
  const response = await fetch(new URL(route, base));
  assert.equal(response.status, 200, route);
  const html = await response.text();
  assert.ok(html.includes('lang="he"') && html.includes('dir="rtl"'), `${route}: Hebrew RTL`);
  assert.ok(html.includes('id="main"'), `${route}: main landmark`);
  if (route === "/atlas") for (let i = 0; i < 12; i++) assert.ok(html.includes(`href="/atlas/${String(i).padStart(2, "0")}"`));
  if (route === "/atlas/09") assert.ok(html.includes('href="/tools/mcp"'));
  if (route.startsWith("/atlas/")) {
    assert.ok(html.includes('<table class="tools-table"'), `${route}: table is the default view`);
    assert.ok(html.includes('aria-label="תצוגת כלים"') && html.includes("כרטיסיות"), `${route}: view toggle`);
    assert.ok(html.includes("על הנתונים ומדד הפופולריות"), `${route}: metric definitions`);
    const categoryId = route.split("/").pop();
    for (const entry of entries.filter(item => item.categoryIds.includes(categoryId))) assert.ok(html.includes(`href="/tools/${entry.slug}"`));
    assert.ok(!html.includes("התוכן בתחום הזה בהכנה"));
  }
  if (route.startsWith("/tools/")) {
    const entry = entries.find(item => route === `/tools/${item.slug}`);
    assert.ok(html.includes('id="practice"') && html.includes('id="sources"'));
    for (const source of entry.sources) assert.ok(html.includes(`href="${source.url}"`), `${route}: source link`);
    for (const slug of entry.relatedSlugs ?? []) assert.ok(html.includes(`href="/tools/${slug}"`), `${route}: related link`);
  }
  if (route === "/tools/mcp") assert.ok(html.includes('href="https://modelcontextprotocol.io/'));
  console.log(`PASS ${route}`);
}
for (const route of ["/atlas/99", "/tools/missing", "/missing-page"]) {
  assert.equal((await fetch(new URL(route, base))).status, 404, route);
  console.log(`PASS ${route}: 404`);
}
