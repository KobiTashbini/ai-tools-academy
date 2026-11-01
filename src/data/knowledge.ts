import type { Category, KnowledgeEntry } from "@/domain/knowledge";
import { catalog, type CategoryGuide } from "./catalog-source";

// The snapshot is validated on load; the site exposes published entries only.
const categories: readonly Category[] = catalog.categories;
const entries: readonly KnowledgeEntry[] = catalog.entries;

export function listCategories() { return categories; }
export function getCategory(id: string) { return categories.find(category => category.id === id); }
export function listPublishedEntries() { return entries.filter(entry => entry.publicationStatus === "published"); }
export function getEntry(slug: string) { return listPublishedEntries().find(entry => entry.slug === slug); }
export function listCategoryEntries(id: string) { return listPublishedEntries().filter(entry => entry.categoryIds.includes(id)); }
export function getCategoryGuide(id: string): CategoryGuide | undefined { return catalog.guides[id]; }
