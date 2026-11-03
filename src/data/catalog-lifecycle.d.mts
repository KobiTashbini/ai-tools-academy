import type { KnowledgeEntry } from '../domain/knowledge';
export function partitionCatalogEntries(entries:readonly KnowledgeEntry[]):{active:KnowledgeEntry[];historical:KnowledgeEntry[]};
export function searchableEntries(catalog:{entries:readonly KnowledgeEntry[];historicalEntries?:readonly KnowledgeEntry[]}):KnowledgeEntry[];
export function searchCatalogEntries(entries:readonly KnowledgeEntry[],query:string):KnowledgeEntry[];
export function activeAlternatives(entry:KnowledgeEntry,entries:readonly KnowledgeEntry[]):KnowledgeEntry[];
