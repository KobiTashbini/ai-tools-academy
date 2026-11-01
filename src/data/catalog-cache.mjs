// In-process cache for the catalog read model.
// - Fresh for `ttlMs`; concurrent callers share one load.
// - If a refresh fails and a previous catalog exists, keep serving it and retry after `retryMs`.
// - With no previous catalog (e.g. first load during build), the error propagates.
export function createCatalogCache({ load, ttlMs, retryMs = 30_000, now = Date.now, warn = console.warn }) {
  let value, nextLoadAt = 0, pending = null;
  return function getCatalog() {
    if (value !== undefined && now() < nextLoadAt) return Promise.resolve(value);
    pending ??= load().then(
      next => { value = next; nextLoadAt = now() + ttlMs; return next; },
      error => {
        if (value === undefined) throw error;
        warn(`catalog: refresh failed, serving the previous catalog: ${error.message}`);
        nextLoadAt = now() + retryMs;
        return value;
      },
    ).finally(() => { pending = null; });
    return pending;
  };
}
