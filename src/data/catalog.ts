import { getDatabaseCatalog } from './database';
export async function getCatalogFacts(slugs:readonly string[]){const {facts}=await getDatabaseCatalog();return Object.fromEntries(slugs.map(s=>[s,facts[s]]));}
