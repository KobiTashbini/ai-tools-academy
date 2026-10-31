import snapshot from "../../content/category-02-metric-snapshot.json";
import presentation from "../../content/category-02-presentation.json";
import community from "../../content/category-02-community-interest.json";
import { buildAgentMetrics } from "./agent-catalog.mjs";
import type { KnowledgeEntry } from "@/domain/knowledge";
export function getAgentMetrics(entries: readonly KnowledgeEntry[]) {
  return buildAgentMetrics(entries, presentation, snapshot, community);
}
