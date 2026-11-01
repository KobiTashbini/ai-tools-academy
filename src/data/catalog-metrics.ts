import { catalog } from "./catalog-source";
import type { KnowledgeEntry } from "@/domain/knowledge";
import type { AgentMetric } from "@/domain/agent-catalog";

// Interest scores, ranks and learning reasons are computed by the database export (src/data/catalog-export.mjs).
export function getCatalogMetrics(entries: readonly KnowledgeEntry[]): Record<string, AgentMetric> {
  return Object.fromEntries(entries.map(entry => [entry.slug, catalog.metrics[entry.slug]]));
}
