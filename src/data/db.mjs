// Server-only PostgreSQL access for the published catalog (role academy_build_reader).
// Configuration comes from the environment; Next.js loads .env.local automatically.
//   DATABASE_URL     postgresql://academy_build_reader.<project-ref>:<password>@<pooler-host>:5432/postgres
//   DATABASE_SSL_CA  optional path to the Supabase CA certificate; enables certificate verification
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import pg from "pg";

export function connectionConfig(env = process.env) {
  if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set. Add it to .env.local (see database/README.md).");
  const url = new URL(env.DATABASE_URL);
  // node-postgres lets `sslmode` in the URL override the ssl object below; TLS is configured here instead.
  url.searchParams.delete("sslmode");
  const ssl = env.DATABASE_SSL_CA
    ? { ca: readFileSync(resolve(env.DATABASE_SSL_CA), "utf8"), rejectUnauthorized: true }
    : { rejectUnauthorized: false };
  return { connectionString: url.toString(), ssl, max: 3, idleTimeoutMillis: 10_000, connectionTimeoutMillis: 15_000, query_timeout: 30_000, application_name: "ai-tools-academy" };
}

// One pool per process; kept on globalThis so dev hot reloads do not open new pools.
const poolKey = Symbol.for("ai-tools-academy.pg-pool");
function getPool() {
  if (!globalThis[poolKey]) {
    if (!process.env.DATABASE_SSL_CA) console.warn("database: TLS is encrypted but the server certificate is not verified (set DATABASE_SSL_CA to verify).");
    const pool = new pg.Pool(connectionConfig());
    // An idle connection dropped by the server must not crash the process.
    pool.on("error", error => console.warn(`database: idle connection error: ${error.message}`));
    globalThis[poolKey] = pool;
  }
  return globalThis[poolKey];
}

/** Runs `work(query)` inside one read-only, repeatable-read transaction so every query sees the same moment. */
export async function readOnlyTransaction(work) {
  const client = await getPool().connect();
  try {
    await client.query("begin transaction isolation level repeatable read read only");
    const result = await work(async sql => (await client.query(sql)).rows);
    await client.query("commit");
    return result;
  } catch (error) {
    await client.query("rollback").catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}

export async function closePool() {
  await globalThis[poolKey]?.end();
  globalThis[poolKey] = undefined;
}
