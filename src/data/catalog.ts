import { catalog } from "./catalog-source";
import type { ToolFacts } from "@/domain/tool-facts";

export function getCatalogFacts(slugs: readonly string[]): Record<string, ToolFacts> {
  return Object.fromEntries(slugs.map(slug => [slug, catalog.facts[slug]]));
}
