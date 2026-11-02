import type { Category, KnowledgeEntry } from '../domain/knowledge';
import type { ToolFacts } from '../domain/tool-facts';
import type { AgentMetric } from '../domain/agent-catalog';
export function readDatabaseCatalog(client: {query(sql:string):Promise<{rows:any[]}>}): Promise<{categories:Category[];entries:KnowledgeEntry[];facts:Record<string,ToolFacts>;metrics:Record<string,AgentMetric>;guides:Record<string,{title:string;intro:string;note:string;steps:{text:string;slug:string;label:string}[]}>}>;
