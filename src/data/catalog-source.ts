import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Category, KnowledgeEntry } from "@/domain/knowledge";
import type { ToolFacts } from "@/domain/tool-facts";
import type { AgentMetric } from "@/domain/agent-catalog";
import { validateContent } from "./validate-content.mjs";

export type CategoryGuide = { title: string; intro: string; steps: { text: string; slug: string; label: string }[]; note: string };
type CatalogSnapshot = {
  formatVersion: 1;
  exportedAt: string;
  source?: "postgresql" | "local-rehearsal";
  categories: Category[];
  entries: KnowledgeEntry[];
  facts: Record<string, ToolFacts>;
  metrics: Record<string, AgentMetric>;
  guides: Record<string, CategoryGuide>;
};

// Server-only: the snapshot is exported from PostgreSQL by scripts/export-catalog.mjs before dev/build.
const snapshotFile = join(process.cwd(), "generated", "catalog.json");

function loadCatalog(): CatalogSnapshot {
  let raw: string;
  try {
    raw = readFileSync(snapshotFile, "utf8");
  } catch {
    throw new Error(`Catalog snapshot not found at ${snapshotFile}. Run "npm run catalog:export" (requires DATABASE_URL in .env.local).`);
  }
  const data = JSON.parse(raw) as CatalogSnapshot;
  if (data.formatVersion !== 1) throw new Error(`Unsupported catalog snapshot format: ${data.formatVersion}`);
  validateContent(data.categories, data.entries);
  for (const entry of data.entries) {
    if (!data.facts[entry.slug] || !data.metrics[entry.slug]?.learningReason) throw new Error(`Catalog snapshot is missing table data for ${entry.slug}`);
  }
  return data;
}

export const catalog = loadCatalog();
