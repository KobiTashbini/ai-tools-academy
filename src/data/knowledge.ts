import categoryData from "../../content/categories.json";
import entryData from "../../content/entries.json";
import lessonData from "../../content/lessons.json";
import type { Category, KnowledgeEntry } from "@/domain/knowledge";
import { validateContent } from "./validate-content.mjs";
import { assembleEntries } from "./assemble-entries.mjs";

const allEntries = assembleEntries(entryData, lessonData);
validateContent(categoryData, allEntries);
const categories: readonly Category[] = categoryData;
// The validator checks JSON before the application exposes any entries.
const entries = allEntries as readonly KnowledgeEntry[];

export function listCategories() { return categories; }
export function getCategory(id: string) { return categories.find(category => category.id === id); }
export function listPublishedEntries() { return entries.filter(entry => entry.publicationStatus === "published"); }
export function getEntry(slug: string) { return listPublishedEntries().find(entry => entry.slug === slug); }
export function listCategoryEntries(id: string) { return listPublishedEntries().filter(entry => entry.categoryIds.includes(id)); }
