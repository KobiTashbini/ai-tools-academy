export function assembleToolFacts(data, snapshots, entries) {
  const fail = message => { throw new Error(`Invalid tool facts: ${message}`); };
  const https = value => { try { return new URL(value).protocol === "https:"; } catch { return false; } };
  const date = value => typeof value === "string" && !Number.isNaN(Date.parse(value));
  if (!date(data.collectedAt) || !https(data.popularity.source) || data.popularity.score !== null) fail("popularity requires documented historical inputs; no score is available");
  const slugs = new Set(entries.map(entry => entry.slug));
  if (Object.keys(data.entries).some(slug => !slugs.has(slug)) || Object.keys(snapshots).some(slug => !slugs.has(slug))) fail("unknown entry");
  return Object.fromEntries(entries.map(entry => {
    const facts = data.entries[entry.slug];
    if (!facts) fail(`missing ${entry.slug}`);
    const words = facts.description?.trim().split(/\s+/).length;
    if (!words || words < 8 || words > 18 || !facts.languages) fail(`description or languages: ${entry.slug}`);
    const github = snapshots[entry.slug] ?? facts.github ?? { status: "unverified", scope: "לא אומת מאגר רשמי מתאים." };
    if (github.status === "verified") {
      if (!https(github.url) || !/^https:\/\/github\.com\/[^/]+\/[^/]+$/.test(github.url) || !https(github.starsSource) || !Number.isInteger(github.stars) || github.stars < 0 || !date(github.collectedAt)) fail(`repository snapshot: ${entry.slug}`);
      if (github.lastActivity && (github.lastActivity.method !== "default_branch_head_commit_committer_date" || !date(github.lastActivity.date) || !https(github.lastActivity.source) || !github.lastActivity.branch)) fail(`activity: ${entry.slug}`);
    } else if (!["not_applicable", "unverified"].includes(github.status) || github.stars !== undefined || github.lastActivity) fail(`repository status: ${entry.slug}`);
    if (facts.release) {
      const release = facts.release;
      const valid = release.precision === "year" ? /^\d{4}$/.test(release.value) : release.precision === "day" && /^\d{4}-\d{2}-\d{2}$/.test(release.value) && date(release.value) && new Date(release.value).toISOString().slice(0,10) === release.value;
      if (!valid || !https(release.source) || !release.note) fail(`first public release: ${entry.slug}`);
    }
    return [entry.slug, { ...facts, github, languageSources: entry.sources.map(source => source.url), popularity: { ...data.popularity, collectedAt: data.collectedAt } }];
  }));
}

export function formatDate(value) {
  if (!value) return "לא אומת";
  if (/^\d{4}$/.test(value)) return value;
  const [year, month, day] = value.slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}

export function sortTools(entries, facts, key, direction) {
  const value = entry => {
    const fact = facts[entry.slug];
    if (key === "release") return fact.release ? Date.parse(fact.release.precision === "year" ? `${fact.release.value}-01-01` : fact.release.value) : null;
    if (key === "stars") return fact.github.status === "verified" ? fact.github.stars ?? null : null;
    if (key === "popularity") return fact.popularity.score;
    return entry.name;
  };
  return [...entries].sort((a, b) => {
    const av = value(a), bv = value(b);
    // Unknown values always stay at the end, in either direction.
    if (av == null && bv == null) return a.name.localeCompare(b.name, "en");
    if (av == null) return 1;
    if (bv == null) return -1;
    const order = typeof av === "string" ? av.localeCompare(bv, "en") : av - bv;
    return order ? order * (direction === "asc" ? 1 : -1) : a.name.localeCompare(b.name, "en");
  });
}
