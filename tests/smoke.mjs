import assert from "node:assert/strict";

const base = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3000";
const routes = ["/", "/atlas", ...Array.from({ length: 12 }, (_, i) => `/atlas/${String(i).padStart(2, "0")}`), "/tools/mcp"];
for (const route of routes) {
  const response = await fetch(new URL(route, base));
  assert.equal(response.status, 200, route);
  const html = await response.text();
  assert.ok(html.includes('lang="he"') && html.includes('dir="rtl"'), `${route}: Hebrew RTL`);
  assert.ok(html.includes('id="main"'), `${route}: main landmark`);
  if (route === "/atlas") for (let i = 0; i < 12; i++) assert.ok(html.includes(`href="/atlas/${String(i).padStart(2, "0")}"`));
  if (route === "/atlas/09") assert.ok(html.includes('href="/tools/mcp"'));
  if (route === "/atlas/00") assert.ok(html.includes("התוכן בתחום הזה בהכנה"));
  if (route === "/tools/mcp") assert.ok(html.includes('href="https://modelcontextprotocol.io/'));
  console.log(`PASS ${route}`);
}
for (const route of ["/atlas/99", "/tools/missing", "/missing-page"]) {
  assert.equal((await fetch(new URL(route, base))).status, 404, route);
  console.log(`PASS ${route}: 404`);
}
