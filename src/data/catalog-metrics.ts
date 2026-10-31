import presentation from "../../content/catalog-presentation.json";
import { getAgentMetrics } from "./agent-metrics";
import { getCatalogFacts } from "./catalog";
import { listPublishedEntries } from "./knowledge";
import type { KnowledgeEntry } from "@/domain/knowledge";
import type { AgentMetric } from "@/domain/agent-catalog";
import inferenceCommunity from "../../content/inference-community-interest.json";
import snapshots from "../../content/github-snapshot.json";
import { buildInferenceInterest } from "./inference-metrics.mjs";
import guidance from "../../content/learning-guidance.json";

// Keep the original seven-repository baseline, even for tools listed in several categories.
const agentMetrics = getAgentMetrics(listPublishedEntries());
const inferenceInterest = buildInferenceInterest(inferenceCommunity, snapshots);
const languages: Record<string, string[]> = presentation;
const learningReasons: Record<string, string> = guidance.reasons;
export function getCatalogMetrics(entries: readonly KnowledgeEntry[]): Record<string, AgentMetric> {
  const facts = getCatalogFacts(entries.map(entry => entry.slug));
  return Object.fromEntries(entries.map(entry => {
    const learningReason = learningReasons[entry.slug];
    if (!entry.learningPriority || !learningReason?.trim()) throw new Error(`Missing learning guidance: ${entry.slug}`);
    if (agentMetrics[entry.slug]) return [entry.slug, {...agentMetrics[entry.slug], learningReason}];
    if (!languages[entry.slug]?.length) throw new Error(`Missing compact languages: ${entry.slug}`);
    return [entry.slug, {slug: entry.slug, description: facts[entry.slug].description, languages: languages[entry.slug], learningReason, communityInterest: inferenceInterest[entry.slug], collectedAt: facts[entry.slug].github.collectedAt ?? facts[entry.slug].popularity.collectedAt}];
  }));
}
