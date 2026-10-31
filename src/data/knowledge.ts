import categoryData from "../../content/categories.json";
import entryData from "../../content/entries.json";
import type { Category, KnowledgeEntry } from "@/domain/knowledge";
import { validateContent } from "./validate-content.mjs";

validateContent(categoryData, entryData);
const categories: readonly Category[] = categoryData;
// The validator checks JSON before the application exposes any entries.
const entries = entryData as readonly KnowledgeEntry[];

export function listCategories() { return categories; }
export function getCategory(id: string) { return categories.find(category => category.id === id); }
export function listPublishedEntries() { return entries.filter(entry => entry.publicationStatus === "published"); }
export function getEntry(slug: string) { return listPublishedEntries().find(entry => entry.slug === slug); }
export function listCategoryEntries(id: string) { return listPublishedEntries().filter(entry => entry.categoryIds.includes(id)); }
