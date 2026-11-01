import { getCatalog } from "./catalog-source";
import type { KnowledgeEntry } from "@/domain/knowledge";
import type { AgentMetric } from "@/domain/agent-catalog";

// Interest scores, ranks and learning reasons are computed from the database (src/data/catalog-export.mjs).
export async function getCatalogMetrics(entries: readonly KnowledgeEntry[]): Promise<Record<string, AgentMetric>> {
  const { metrics } = await getCatalog();
  return Object.fromEntries(entries.map(entry => [entry.slug, metrics[entry.slug]]));
}
