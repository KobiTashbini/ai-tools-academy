export function createCatalogCache<T>(options: {
  load: () => Promise<T>;
  ttlMs: number;
  retryMs?: number;
  now?: () => number;
  warn?: (message: string) => void;
}): () => Promise<T>;
