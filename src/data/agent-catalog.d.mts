import type { KnowledgeEntry } from "../domain/knowledge";
import type { ToolFacts } from "../domain/tool-facts";
import type { AgentMetric } from "../domain/agent-catalog";
export function buildAgentMetrics(entries: readonly KnowledgeEntry[], presentation: unknown, snapshot: unknown, community: unknown): Record<string, AgentMetric>;
export function sortAgentEntries(entries: readonly KnowledgeEntry[], facts: Readonly<Record<string, ToolFacts>>, metrics: Readonly<Record<string, AgentMetric>>, key: string, direction: "asc" | "desc"): KnowledgeEntry[];
