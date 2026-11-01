// Connects with DATABASE_URL (from .env.local), reads the published catalog exactly as the site does,
// validates it and prints a summary. Use it to check the connection and data before running the site.
//   npm run catalog:check
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { exportCatalog } from "../src/data/catalog-export.mjs";
import { validateContent } from "../src/data/validate-content.mjs";
import { closePool, readOnlyTransaction } from "../src/data/db.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
try { process.loadEnvFile(resolve(root, ".env.local")); } catch (error) { if (error.code !== "ENOENT") throw error; }

try {
  const catalog = await readOnlyTransaction(exportCatalog);
  validateContent(catalog.categories, catalog.entries);
  const scored = Object.values(catalog.metrics).filter(metric => metric.communityInterest).length;
  console.log(`catalog:check OK: ${catalog.categories.length} categories, ${catalog.entries.length} published entries, ${scored} with GitHub Interest, ${Object.keys(catalog.guides).length} category guides.`);
} catch (error) {
  console.error(`catalog:check failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await closePool();
}
