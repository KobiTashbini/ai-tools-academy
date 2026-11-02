import { getDatabaseCatalog } from './database';
export async function listCategories(){return (await getDatabaseCatalog()).categories;}
export async function getCategory(id:string){return (await listCategories()).find(c=>c.id===id);}
export async function listPublishedEntries(){return (await getDatabaseCatalog()).entries;}
export async function getEntry(slug:string){return (await listPublishedEntries()).find(e=>e.slug===slug);}
export async function listCategoryEntries(id:string){return (await listPublishedEntries()).filter(e=>e.categoryIds.includes(id));}
