import { getDatabaseCatalog } from './database';
import type { KnowledgeEntry } from '@/domain/knowledge';
export async function getCatalogMetrics(entries:readonly KnowledgeEntry[]){const {metrics}=await getDatabaseCatalog();return Object.fromEntries(entries.map(e=>[e.slug,metrics[e.slug]]));}
