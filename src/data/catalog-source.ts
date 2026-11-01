import type { Category, KnowledgeEntry } from "@/domain/knowledge";
import type { ToolFacts } from "@/domain/tool-facts";
import type { AgentMetric } from "@/domain/agent-catalog";
import { validateContent } from "./validate-content.mjs";
import { exportCatalog } from "./catalog-export.mjs";
import { createCatalogCache } from "./catalog-cache.mjs";
import { readOnlyTransaction } from "./db.mjs";

export type CategoryGuide = { title: string; intro: string; steps: { text: string; slug: string; label: string }[]; note: string };
export type Catalog = {
  formatVersion: 1;
  categories: Category[];
  entries: KnowledgeEntry[];
  facts: Record<string, ToolFacts>;
  metrics: Record<string, AgentMetric>;
  guides: Record<string, CategoryGuide>;
};

// Server-only: reads the published catalog directly from PostgreSQL (schema academy).
async function loadCatalog(): Promise<Catalog> {
  const data = (await readOnlyTransaction(exportCatalog)) as Catalog;
  validateContent(data.categories, data.entries);
  for (const entry of data.entries) {
    if (!data.facts[entry.slug] || !data.metrics[entry.slug]?.learningReason) throw new Error(`Catalog is missing table data for ${entry.slug}`);
  }
  return data;
}

// Pages revalidate every 5 minutes (see `revalidate` in each page); the shorter cache
// TTL keeps a regeneration from reusing data older than about a minute.
export const getCatalog = createCatalogCache({ load: loadCatalog, ttlMs: 60_000 });
