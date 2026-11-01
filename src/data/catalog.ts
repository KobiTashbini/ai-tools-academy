import { getCatalog } from "./catalog-source";
import type { ToolFacts } from "@/domain/tool-facts";

export async function getCatalogFacts(slugs: readonly string[]): Promise<Record<string, ToolFacts>> {
  const { facts } = await getCatalog();
  return Object.fromEntries(slugs.map(slug => [slug, facts[slug]]));
}
