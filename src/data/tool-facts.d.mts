import type { KnowledgeEntry } from "../domain/knowledge";
import type { ToolFacts, SortKey, SortDirection } from "../domain/tool-facts";
export function assembleToolFacts(data: unknown, snapshots: unknown, entries: readonly KnowledgeEntry[]): unknown;
export function formatDate(value?: string): string;
export function sortTools(entries: readonly KnowledgeEntry[], facts: Readonly<Record<string, ToolFacts>>, key: SortKey, direction: SortDirection): KnowledgeEntry[];
