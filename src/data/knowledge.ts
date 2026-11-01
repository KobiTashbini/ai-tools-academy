import type { Category, KnowledgeEntry } from "@/domain/knowledge";
import { getCatalog, type CategoryGuide } from "./catalog-source";

// The catalog is validated on load; the site exposes published entries only.
export async function listCategories(): Promise<readonly Category[]> { return (await getCatalog()).categories; }
export async function getCategory(id: string) { return (await listCategories()).find(category => category.id === id); }
export async function listPublishedEntries(): Promise<readonly KnowledgeEntry[]> {
  return (await getCatalog()).entries.filter(entry => entry.publicationStatus === "published");
}
export async function getEntry(slug: string) { return (await listPublishedEntries()).find(entry => entry.slug === slug); }
export async function listCategoryEntries(id: string) { return (await listPublishedEntries()).filter(entry => entry.categoryIds.includes(id)); }
export async function getCategoryGuide(id: string): Promise<CategoryGuide | undefined> { return (await getCatalog()).guides[id]; }
