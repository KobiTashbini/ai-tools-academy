import factData from "../../content/tool-facts.json";
import snapshots from "../../content/github-snapshot.json";
import { listPublishedEntries } from "./knowledge";
import { assembleToolFacts } from "./tool-facts.mjs";
import type { ToolFacts } from "@/domain/tool-facts";

const facts = assembleToolFacts(factData, snapshots, listPublishedEntries()) as Record<string, ToolFacts>;
export function getCatalogFacts(slugs: readonly string[]) {
  return Object.fromEntries(slugs.map(slug => [slug, facts[slug]]));
}
