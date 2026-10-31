import presentation from "../../content/catalog-presentation.json";
import { getAgentMetrics } from "./agent-metrics";
import { getCatalogFacts } from "./catalog";
import { listPublishedEntries } from "./knowledge";
import type { KnowledgeEntry } from "@/domain/knowledge";
import type { AgentMetric } from "@/domain/agent-catalog";

// Keep the original seven-repository baseline, even for tools listed in several categories.
const agentMetrics = getAgentMetrics(listPublishedEntries());
const languages: Record<string, string[]> = presentation;
export function getCatalogMetrics(entries: readonly KnowledgeEntry[]): Record<string, AgentMetric> {
  const facts = getCatalogFacts(entries.map(entry => entry.slug));
  return Object.fromEntries(entries.map(entry => {
    if (agentMetrics[entry.slug]) return [entry.slug, agentMetrics[entry.slug]];
    if (!languages[entry.slug]?.length) throw new Error(`Missing compact languages: ${entry.slug}`);
    return [entry.slug, {slug: entry.slug, description: facts[entry.slug].description, languages: languages[entry.slug], collectedAt: facts[entry.slug].popularity.collectedAt}];
  }));
}
