import type { Query } from "./db.mjs";
export const SNAPSHOT_FORMAT_VERSION: 1;
export function isoFromMs(value: number | null | undefined): string | null;
export function exportCatalog(query: Query): Promise<unknown>;
