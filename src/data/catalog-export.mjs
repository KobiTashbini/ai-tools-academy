// Builds the read model the site renders from the normalized `academy` schema.
// `query` runs one SQL statement and resolves to its rows, so the same mapping
// works with node-postgres in production and PGlite in tests.
//
// Values are cast in SQL (dates to text, timestamps to epoch milliseconds,
// bigint/numeric to float8) so driver-specific type parsing never leaks into
// the snapshot and no timezone shift can move a date.

export const SNAPSHOT_FORMAT_VERSION = 1;
const NPMS_METHOD_SOURCE = "https://github.com/npms-io/npms-analyzer/blob/master/lib/scoring/score.js";
const UNVERIFIED_REPOSITORY = { status: "unverified", scope: "לא אומת מאגר רשמי מתאים." };
const ms = column => `round(extract(epoch from ${column})*1000)::float8`;

/** ISO-8601 in UTC; whole seconds keep the short `...:SSZ` form used by the collected evidence. */
export function isoFromMs(value) {
  return value == null ? null : new Date(value).toISOString().replace(".000Z", "Z");
}

const groupBy = (rows, key) => rows.reduce((map, row) => map.set(row[key], [...(map.get(row[key]) ?? []), row]), new Map());

export async function exportCatalog(query) {
  const fail = message => { throw new Error(`Catalog export: ${message}`); };

  const categories = await query("select id,name,description from academy.categories order by id");

  const entries = (await query("select slug,document from academy.entry_documents order by slug"))
    .map(row => row.document)
    .filter(entry => entry.publicationStatus === "published");
  const published = new Set(entries.map(entry => entry.slug));

  const factRows = await query(`select e.slug,f.description,f.language_support_summary,f.repository_status,f.repository_note,${ms("f.reviewed_at")} as reviewed_ms
    from academy.catalog_facts f join academy.entries e on e.id=f.entry_id`);
  const labelRows = await query(`select e.slug,l.label from academy.entry_language_labels l
    join academy.entries e on e.id=l.entry_id order by e.slug,l.position`);
  const releaseRows = await query(`select e.slug,r.release_year,to_char(r.release_date,'YYYY-MM-DD') as release_date,r.precision,r.source_url,r.note
    from academy.entry_releases r join academy.entries e on e.id=r.entry_id`);
  // The catalog shows the most recent measurement that also recorded repository activity.
  // Cohort-only measurements (Stars/Forks for GitHub Interest) are read separately below.
  const repositoryRows = await query(`select distinct on (r.url) e.slug,r.url,r.scope_note,s.stars::float8 as stars,s.forks::float8 as forks,
      s.source_url,${ms("s.collected_at")} as collected_ms,${ms("s.last_activity_at")} as activity_ms,s.activity_source_url,s.branch,s.activity_method
    from academy.repositories r join academy.entries e on e.id=r.entry_id
    join academy.repository_snapshots s on s.repository_url=r.url
    where s.last_activity_at is not null order by r.url,s.collected_at desc`);
  const [compass] = await query("select name,source_url,note from academy.metric_methods where id='oss_compass_v3'");
  const cohortRows = await query(`select o.cohort_id,c.label,m.name as method,e.slug,r.url as repository,s.source_url,
      s.stars::float8 as stars,s.forks::float8 as forks,${ms("o.collected_at")} as collected_ms
    from academy.cohort_observations o join academy.metric_cohorts c on c.id=o.cohort_id
    join academy.metric_methods m on m.id=c.method_id
    join academy.repository_snapshots s on s.repository_url=o.repository_url and s.collected_at=o.collected_at
    join academy.repositories r on r.url=o.repository_url join academy.entries e on e.id=r.entry_id`);
  const packageRows = await query(`select e.slug,p.method_id,p.value::float8 as value,p.request_status,p.source_url,p.package_name,p.ecosystem,
      ${ms("p.measured_at")} as measured_ms,${ms("p.collected_at")} as collected_ms,p.package_repository_url,p.identity_source_url
    from academy.package_metrics p join academy.entries e on e.id=p.entry_id`);
  const guideRows = await query("select category_id,title,introduction,note from academy.category_guides order by category_id");
  const stepRows = await query(`select s.category_id,s.instruction,s.link_label,e.slug from academy.category_guide_steps s
    join academy.entries e on e.id=s.entry_id order by s.category_id,s.position`);

  const guidanceRows = await query("select e.slug,g.reason from academy.learning_guidance g join academy.entries e on e.id=g.entry_id");

  if (!compass) fail("missing OSS Compass method definition");
  const guidance = new Map(guidanceRows.map(row => [row.slug, row.reason]));
  const facts = new Map(factRows.map(row => [row.slug, row]));
  const labels = groupBy(labelRows, "slug");
  const releases = new Map(releaseRows.map(row => [row.slug, row]));
  const repositories = new Map(repositoryRows.map(row => [row.slug, row]));
  const packages = groupBy(packageRows, "slug");

  // GitHub Interest is relative within one cohort and one collection time: use each cohort's latest collection.
  const interest = new Map();
  for (const [cohort, rows] of groupBy(cohortRows, "cohort_id")) {
    const latest = Math.max(...rows.map(row => row.collected_ms));
    const members = rows.filter(row => row.collected_ms === latest);
    if (members.some(row => !Number.isInteger(row.stars) || !Number.isInteger(row.forks))) fail(`cohort ${cohort} needs Stars and Forks for every member`);
    const maxStars = Math.max(...members.map(row => row.stars));
    const maxForks = Math.max(...members.map(row => row.forks));
    if (!maxStars || !maxForks) fail(`cohort ${cohort} has no positive maximum`);
    for (const row of members) {
      if (interest.has(row.slug)) fail(`${row.slug} belongs to more than one interest cohort`);
      interest.set(row.slug, {
        slug: row.slug, repository: row.repository, source: row.source_url, stars: row.stars, forks: row.forks,
        score: 50 * row.stars / maxStars + 50 * row.forks / maxForks, maxStars, maxForks,
        method: row.method, cohort, ...(row.label ? { cohortLabel: row.label } : {}), collectedAt: isoFromMs(latest),
      });
    }
  }

  const factsBySlug = {}, metricsBySlug = {};
  for (const entry of entries) {
    const slug = entry.slug;
    const fact = facts.get(slug);
    if (!fact) fail(`missing catalog facts for ${slug}`);
    const repo = repositories.get(slug);
    const github = repo ? {
      status: "verified", url: repo.url, scope: repo.scope_note, stars: repo.stars,
      ...(repo.forks == null ? {} : { forks: repo.forks }),
      starsSource: repo.source_url,
      lastActivity: { date: isoFromMs(repo.activity_ms), source: repo.activity_source_url, branch: repo.branch, method: repo.activity_method },
      collectedAt: isoFromMs(repo.collected_ms),
    } : fact.repository_status ? { status: fact.repository_status, scope: fact.repository_note } : UNVERIFIED_REPOSITORY;
    const release = releases.get(slug);
    factsBySlug[slug] = {
      description: fact.description,
      languages: fact.language_support_summary,
      ...(release ? { release: { value: release.precision === "day" ? release.release_date : String(release.release_year), precision: release.precision, source: release.source_url, note: release.note } } : {}),
      github,
      languageSources: entry.sources.map(source => source.url),
      popularity: { algorithm: compass.name, source: compass.source_url, score: null, reason: compass.note, collectedAt: isoFromMs(fact.reviewed_ms) },
    };

    const learningReason = guidance.get(slug);
    if (!entry.learningPriority || !learningReason?.trim()) fail(`missing learning guidance for ${slug}`);
    const metric = { slug, description: fact.description, languages: (labels.get(slug) ?? []).map(row => row.label), learningReason };
    if (!metric.languages.length) fail(`missing language labels for ${slug}`);
    const communityInterest = interest.get(slug);
    if (communityInterest) metric.communityInterest = communityInterest;
    const measured = packages.get(slug) ?? [];
    const rank = measured.find(row => row.method_id === "source_rank");
    if (rank && rank.request_status === "200" && Number.isFinite(rank.value) && rank.source_url?.startsWith("https://libraries.io/api/")
      && communityInterest && rank.package_repository_url?.toLowerCase() === communityInterest.repository.toLowerCase()) {
      metric.sourceRank = { score: rank.value, source: rank.source_url, package: rank.package_name, repository: rank.package_repository_url, platform: rank.ecosystem, updatedAt: isoFromMs(rank.measured_ms) };
    }
    const npms = measured.find(row => row.method_id === "npms_popularity");
    if (npms && Number.isFinite(npms.value) && npms.value >= 0 && npms.value <= 1 && npms.measured_ms != null && npms.package_repository_url) {
      metric.popularity = {
        slug, source: npms.source_url, package: npms.package_name, analyzedAt: isoFromMs(npms.measured_ms), score: npms.value,
        repository: npms.package_repository_url.replace(/^git\+/, "").replace(/\.git$/, ""), identitySource: npms.identity_source_url,
        methodSource: NPMS_METHOD_SOURCE, historical: true,
      };
    }
    // Package-metric pages report their own collection time; other entries use the repository or catalog review time.
    metric.collectedAt = measured.length ? isoFromMs(Math.max(...measured.map(row => row.collected_ms))) : github.collectedAt ?? factsBySlug[slug].popularity.collectedAt;
    metricsBySlug[slug] = metric;
  }

  const steps = groupBy(stepRows, "category_id");
  const guides = Object.fromEntries(guideRows.map(row => [row.category_id, {
    title: row.title, intro: row.introduction, note: row.note,
    steps: (steps.get(row.category_id) ?? []).map(step => ({ text: step.instruction, slug: step.slug, label: step.link_label })),
  }]));
  for (const guide of Object.values(guides)) if (guide.steps.some(step => !published.has(step.slug))) fail("guide links to an unpublished entry");

  return { formatVersion: SNAPSHOT_FORMAT_VERSION, categories, entries, facts: factsBySlug, metrics: metricsBySlug, guides };
}
