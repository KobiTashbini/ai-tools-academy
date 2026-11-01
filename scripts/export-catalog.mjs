// Exports the published catalog from PostgreSQL (Supabase) into generated/catalog.json,
// the only data file the site reads. Runs before `next build` and `next dev`.
//   npm run catalog:export                 strict: fail if the database is unreachable
//   node scripts/export-catalog.mjs --allow-stale   keep the previous snapshot on failure (dev only)
//   npm run catalog:export:local           offline rehearsal: in-memory PostgreSQL (PGlite) built from
//                                          content/*.json with migrations 001-005, read as the build reader
// Configuration (.env.local, never committed):
//   DATABASE_URL     postgresql://academy_build_reader.<project-ref>:<password>@<pooler-host>:5432/postgres
//   DATABASE_SSL_CA  optional path to the Supabase CA certificate; enables certificate verification
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { exportCatalog } from "../src/data/catalog-export.mjs";
import { validateContent } from "../src/data/validate-content.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
export const snapshotFile = resolve(root, "generated/catalog.json");
const allowStale = process.argv.includes("--allow-stale");
const local = process.argv.includes("--local");

function connectionConfig() {
  try { process.loadEnvFile(resolve(root, ".env.local")); } catch (error) { if (error.code !== "ENOENT") throw error; }
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error("DATABASE_URL is not set. Add it to .env.local (see database/README.md), or run \"npm run catalog:export:local\" for an offline snapshot.");
  const url = new URL(raw);
  // node-postgres lets `sslmode` in the URL override the ssl object below; TLS is configured here instead.
  url.searchParams.delete("sslmode");
  const caPath = process.env.DATABASE_SSL_CA;
  const ssl = caPath ? { ca: readFileSync(resolve(root, caPath), "utf8"), rejectUnauthorized: true } : { rejectUnauthorized: false };
  if (!caPath) console.warn("catalog:export: TLS is encrypted but the server certificate is not verified (set DATABASE_SSL_CA to verify).");
  return { connectionString: url.toString(), ssl, connectionTimeoutMillis: 15000, query_timeout: 30000, application_name: "ai-tools-academy-catalog-export" };
}

export function writeSnapshot(snapshot, file = snapshotFile) {
  validateContent(snapshot.categories, snapshot.entries);
  mkdirSync(dirname(file), { recursive: true });
  const temporary = `${file}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(snapshot, null, 2)}\n`);
  // A failed export never leaves a partial catalog behind.
  renameSync(temporary, file);
}

async function exportFromLocalRehearsal() {
  const { PGlite } = await import("@electric-sql/pglite");
  const { prepareDatabase } = await import("./prepare-database.mjs");
  const sql = name => readFileSync(resolve(root, "database", name), "utf8");
  const db = new PGlite();
  try {
    await db.exec(sql("001_catalog.sql"));
    await db.exec(prepareDatabase().sql);
    for (const name of ["002_normalize.sql", "003_merge_catalog_descriptions.sql", "004_detach_archive.sql", "005_build_reader.sql"]) await db.exec(sql(name));
    await db.exec("set role academy_build_reader");
    return await exportCatalog(async text => (await db.query(text)).rows);
  } finally { await db.close(); }
}

async function main() {
  if (local) {
    const snapshot = await exportFromLocalRehearsal();
    writeSnapshot({ ...snapshot, exportedAt: new Date().toISOString(), source: "local-rehearsal" });
    console.log(`catalog:export (local rehearsal): ${snapshot.entries.length} entries -> ${snapshotFile}`);
    return;
  }
  const { default: pg } = await import("pg");
  const client = new pg.Client(connectionConfig());
  await client.connect();
  try {
    // One read-only transaction gives a consistent view across all queries.
    await client.query("begin transaction isolation level repeatable read read only");
    const snapshot = await exportCatalog(async sql => (await client.query(sql)).rows);
    await client.query("commit");
    writeSnapshot({ ...snapshot, exportedAt: new Date().toISOString(), source: "postgresql" });
    console.log(`catalog:export: ${snapshot.entries.length} entries, ${snapshot.categories.length} categories, ${Object.keys(snapshot.guides).length} guides -> ${snapshotFile}`);
  } finally {
    await client.end();
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    if (allowStale && existsSync(snapshotFile)) {
      console.warn(`catalog:export: ${error.message}\ncatalog:export: continuing with the previous snapshot (${snapshotFile}).`);
      return;
    }
    console.error(`catalog:export failed: ${error.message}`);
    process.exitCode = 1;
  });
}
