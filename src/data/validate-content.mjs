export function validateContent(categories, entries) {
  const fail = message => { throw new Error(`Invalid knowledge content: ${message}`); };
  const text = value => typeof value === "string" && value.trim().length > 0;
  const date = value => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
  if (!Array.isArray(categories) || categories.length !== 12) fail("expected 12 categories");
  const categoryIds = new Set();
  for (const [index, category] of categories.entries()) {
    if (category.id !== String(index).padStart(2, "0") || !text(category.name) || !text(category.description)) fail("category taxonomy");
    categoryIds.add(category.id);
  }
  if (!Array.isArray(entries)) fail("entries must be an array");
  const ids = new Set(), slugs = new Set();
  for (const entry of entries) {
    if (!entry || !text(entry.id) || !text(entry.slug) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug) || ids.has(entry.id) || slugs.has(entry.slug)) fail("duplicate or invalid entry identifier");
    ids.add(entry.id); slugs.add(entry.slug);
    if (!date(entry.addedAt) || !["historical_backfill", "approved_proposal"].includes(entry.addedAtBasis)) fail("catalog addition date");
    if (entry.addedAtBasis === "approved_proposal" && (!date(entry.discoveredAt) || !date(entry.approvedAt) || !text(entry.approvalReference) || entry.discoveredAt > entry.approvedAt || entry.approvedAt > entry.addedAt)) fail("catalog addition approval evidence");
    for (const key of ["name", "summary", "example", "exercise", "languageSupportNote", "alternativesNote", "revisionNote"]) if (!text(entry[key])) fail(`missing ${key}`);
    if (!["protocol", "model", "sdk", "framework", "platform", "concept", "product", "database", "runtime", "orchestration_engine"].includes(entry.kind)) fail("entry kind");
    if (!["draft", "in_review", "published", "archived"].includes(entry.publicationStatus)) fail("publication status");
    if (!["unverified", "verified", "needs_review"].includes(entry.verificationStatus)) fail("verification status");
    if (!Array.isArray(entry.categoryIds) || !entry.categoryIds.length || new Set(entry.categoryIds).size !== entry.categoryIds.length || entry.categoryIds.some(id => !categoryIds.has(id))) fail("category reference");
    if (!Array.isArray(entry.sections) || !entry.sections.length || entry.sections.some(section => !text(section.title) || !text(section.text))) fail("sections");
    if (entry.learningPriority !== undefined && !["must_learn", "should_know", "enrichment"].includes(entry.learningPriority)) fail("learning priority");
    if (entry.prerequisites !== undefined && !text(entry.prerequisites)) fail("prerequisites");
    if (entry.relatedSlugs !== undefined && (!Array.isArray(entry.relatedSlugs) || entry.relatedSlugs.some(slug => !text(slug)))) fail("related entries");
    if (!Number.isInteger(entry.revision) || entry.revision < 1) fail("revision");
    if (entry.verifiedAt !== null && !date(entry.verifiedAt)) fail("verification date");
    if (!Array.isArray(entry.sources)) fail("sources");
    for (const source of entry.sources) {
      if (!text(source.title) || !text(source.supports) || !date(source.checkedAt)) fail("source evidence");
      let url; try { url = new URL(source.url); } catch { fail("source URL"); }
      if (url.protocol !== "https:") fail("source URL must use HTTPS");
    }
    if (entry.verificationStatus === "verified" && (!entry.verifiedAt || !entry.sources.length)) fail("verified entry requires evidence and date");
    if (entry.publicationStatus === "published" && !entry.sources.length) fail("published entry requires a source");
  }
  for (const entry of entries) {
    if (entry.relatedSlugs?.some(slug => !slugs.has(slug))) fail("related entry reference");
    if (entry.lifecycle) {
      const l=entry.lifecycle;
      if (!['legacy','maintenance','discontinued'].includes(l.status)||!text(l.note)||(l.successorSlug!==undefined&&(!slugs.has(l.successorSlug)||l.successorSlug===entry.slug))) fail("legacy successor or lifecycle status");
      if(l.sourceUrl!==undefined){
        if(!l.sourceUrl.startsWith('https://')||!date(l.checkedAt)||!date(l.effectiveAt)||l.effectiveAt>l.checkedAt||!text(l.dateLabel)||(l.scheduledEndAt!==undefined&&(!date(l.scheduledEndAt)||l.scheduledEndAt<l.effectiveAt))) fail('lifecycle evidence');
      }else if(l.status!=='legacy'||!l.successorSlug) fail('lifecycle verified source required');
    }
  }
}
