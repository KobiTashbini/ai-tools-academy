import { test } from "node:test";
import assert from "node:assert/strict";
import { createCatalogCache } from "../src/data/catalog-cache.mjs";

function harness(results) {
  let clock = 0, calls = 0;
  const warnings = [];
  const get = createCatalogCache({
    ttlMs: 60_000, retryMs: 30_000, now: () => clock, warn: message => warnings.push(message),
    load: async () => { const next = results[calls++]; if (next instanceof Error) throw next; return next; },
  });
  return { get, warnings, advance: ms => { clock += ms; }, calls: () => calls };
}

test("first load failure propagates: no catalog is invented", async () => {
  const h = harness([new Error("database unavailable")]);
  await assert.rejects(h.get(), /database unavailable/);
});

test("fresh catalog is reused within the TTL and concurrent callers share one load", async () => {
  const h = harness([{ v: 1 }, { v: 2 }]);
  const [a, b] = await Promise.all([h.get(), h.get()]);
  assert.equal(a, b); assert.equal(h.calls(), 1);
  h.advance(59_000); assert.deepEqual(await h.get(), { v: 1 }); assert.equal(h.calls(), 1);
  h.advance(2_000); assert.deepEqual(await h.get(), { v: 2 }); assert.equal(h.calls(), 2);
});

test("failed refresh keeps serving the last good catalog and retries later", async () => {
  const h = harness([{ v: 1 }, new Error("paused"), { v: 3 }]);
  await h.get();
  h.advance(61_000);
  assert.deepEqual(await h.get(), { v: 1 });
  assert.match(h.warnings[0], /paused/);
  h.advance(10_000); assert.deepEqual(await h.get(), { v: 1 }); assert.equal(h.calls(), 2);
  h.advance(21_000); assert.deepEqual(await h.get(), { v: 3 }); assert.equal(h.calls(), 3);
});
