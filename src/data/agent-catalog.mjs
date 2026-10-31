export function buildAgentMetrics(entries, presentation, snapshot, community) {
  if (community.method !== "AI TOOLS GitHub Interest v1" || community.entries.length !== 7 || new Set(community.entries.map(item => item.slug)).size !== 7 || Number.isNaN(Date.parse(community.collectedAt))) throw Error("Invalid interest cohort");
  for (const item of community.entries) {
    if (!entries.some(entry=>entry.slug===item.slug && entry.categoryIds.includes("02")) || !Number.isInteger(item.stars) || item.stars < 0 || !Number.isInteger(item.forks) || item.forks < 0 || !item.repository.startsWith("https://github.com/") || item.source !== item.repository.replace("https://github.com/", "https://api.github.com/repos/")) throw Error("Invalid interest inputs");
  }
  const maxStars = Math.max(...community.entries.map(item=>item.stars));
  const maxForks = Math.max(...community.entries.map(item=>item.forks));
  if (!maxStars || !maxForks) throw Error("Insufficient interest inputs");
  const result = {};
  for (const entry of entries) {
    if (!entry.categoryIds.includes("02")) continue;
    const info = presentation[entry.slug];
    if (!info || info.description.trim().split(/\s+/).length < 8 || info.description.trim().split(/\s+/).length > 15 || !info.languages?.length) throw Error(`Invalid category 02 presentation: ${entry.slug}`);
    const item = { slug: entry.slug, ...info, collectedAt: snapshot.collectedAt };
    const input = community.entries.find(record => record.slug === entry.slug);
    if (!input) throw Error(`Missing interest input: ${entry.slug}`);
    item.communityInterest = { ...input, score: 50 * input.stars / maxStars + 50 * input.forks / maxForks, maxStars, maxForks, method: community.method, cohort: community.cohort, collectedAt: community.collectedAt };
    const rank = snapshot.sourceRank.find(record => record.slug === entry.slug && record.status === 200 && Number.isInteger(record.rank));
    // SourceRank is retained separately; it must never become a popularity value.
    if (rank && rank.repository.toLowerCase() === input.repository.toLowerCase() && rank.source.startsWith("https://libraries.io/api/")) item.sourceRank = { score: rank.rank, source: rank.source, package: rank.name, repository: rank.repository, platform: rank.platform, updatedAt: rank.updatedAt };
    const pop = snapshot.popularity;
    if (pop?.slug === entry.slug && Number.isFinite(pop.score) && pop.score >= 0 && pop.score <= 1 && pop.package === "@temporalio/client" && pop.repository?.url === "git+https://github.com/temporalio/sdk-typescript.git" && !Number.isNaN(Date.parse(pop.analyzedAt))) {
      item.popularity = { ...pop, repository: "https://github.com/temporalio/sdk-typescript", methodSource: "https://github.com/npms-io/npms-analyzer/blob/master/lib/scoring/score.js", historical: true };
    }
    result[entry.slug] = item;
  }
  return result;
}

export function sortAgentEntries(entries, facts, metrics, key, direction) {
  const value = entry => key === "name" ? entry.name : key === "popularity" ? metrics[entry.slug].communityInterest?.score : key === "sourceRank" ? metrics[entry.slug].sourceRank?.score : key === "stars" ? facts[entry.slug].github.stars : key === "activity" ? Date.parse(facts[entry.slug].github.lastActivity?.date ?? "") || null : facts[entry.slug].release ? Date.parse(facts[entry.slug].release.value.length === 4 ? `${facts[entry.slug].release.value}-01-01` : facts[entry.slug].release.value) : null;
  return [...entries].sort((a,b) => {
    const av = value(a), bv = value(b);
    if (av == null && bv == null) return a.name.localeCompare(b.name,"en");
    if (av == null) return 1;
    if (bv == null) return -1;
    const order = typeof av === "string" ? av.localeCompare(bv,"en") : av-bv;
    return order ? order * (direction === "asc" ? 1 : -1) : a.name.localeCompare(b.name,"en");
  });
}
