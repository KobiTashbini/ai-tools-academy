import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { prepareDatabase } from '../scripts/prepare-database.mjs';

test('PostgreSQL import preserves every entry and raw source; protects reruns and private data', async () => {
  const db = new PGlite();
  try {
    const data = prepareDatabase();
    await db.exec(readFileSync(new URL('../database/001_catalog.sql', import.meta.url), 'utf8'));
    await db.exec(data.sql);
    const entries = (await db.query('select payload from academy.entries order by slug')).rows.map(r => r.payload);
    assert.deepEqual(entries, [...data.entries].sort((a,b) => a.slug.localeCompare(b.slug, 'en')));
    const docs = (await db.query('select path, raw_text, document from academy.source_documents')).rows;
    assert.equal(docs.length, data.documents.length);
    for (const d of data.documents) {
      const row = docs.find(r => r.path === d.path);
      assert.equal(row.raw_text, d.raw);
      assert.deepEqual(row.document, d.document);
    }
    assert.equal((await db.query('select count(*)::int as n from academy.categories')).rows[0].n, 12);
    assert.equal((await db.query('select count(*)::int as n from academy.learning_guidance')).rows[0].n, 35);
    await assert.rejects(db.exec(data.sql), /requires an empty catalog/);
    await db.exec('rollback');
    assert.equal((await db.query('select count(*)::int as n from academy.entries')).rows[0].n, 35);
    await assert.rejects(db.exec("insert into academy.entry_categories values ('mcp','99')"), /foreign key/);
    const tables = (await db.query("select relrowsecurity from pg_class join pg_namespace n on n.oid=relnamespace where n.nspname='academy' and relkind='r'")).rows;
    assert.ok(tables.length > 0 && tables.every(t => t.relrowsecurity));
    await db.exec('create role academy_untrusted; set role academy_untrusted');
    await assert.rejects(db.query('select * from academy.research_proposals'), /permission denied/);
    await db.exec('reset role');
  } finally { await db.close(); }
});
