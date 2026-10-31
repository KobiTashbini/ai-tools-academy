export function validateProposals(data, entries, categories) {
  const fail = message => {throw Error(`Invalid research proposal: ${message}`);};
  const text = value => typeof value === 'string' && value.trim().length > 0;
  const date = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value;
  if(data?.schemaVersion !== 1 || !Array.isArray(data.proposals)) fail('queue');
  const ids=new Set(), categoryIds=new Set(categories.map(c=>c.id)), slugs=new Set(entries.map(e=>e.slug));
  for(const item of data.proposals) {
    if(!text(item.id) || ids.has(item.id) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug ?? '')) fail('identity');
    ids.add(item.id);
    if(!['new_tool','learning_priority','source_update','metric_update'].includes(item.kind) || !['pending_review','approved','rejected','applied'].includes(item.status)) fail('kind or status');
    for(const key of ['title','currentValue','proposedValue','rationale','tradeoffs']) if(!text(item[key])) fail(key);
    if(!date(item.discoveredAt) || !date(item.checkedAt) || item.discoveredAt>item.checkedAt || !['low','medium','high'].includes(item.confidence)) fail('dates or confidence');
    if(!Array.isArray(item.categoryIds) || !item.categoryIds.length || item.categoryIds.some(id=>!categoryIds.has(id))) fail('categories');
    if(item.kind !== 'new_tool' && !slugs.has(item.slug)) fail('missing existing target');
    if(item.kind === 'new_tool' && item.status !== 'applied' && slugs.has(item.slug)) fail('duplicate catalog entry');
    if(item.status === 'applied' && !slugs.has(item.slug)) fail('applied target absent');
    if(!Array.isArray(item.sources) || !item.sources.length || !item.sources.some(s=>s.kind === 'official')) fail('official evidence');
    for(const source of item.sources) {
      if(!text(source.title) || !text(source.supports) || !date(source.checkedAt) || source.checkedAt>item.checkedAt || !['official','independent','vendor_claim'].includes(source.kind)) fail('source evidence');
      let url; try {url=new URL(source.url);} catch {fail('source URL');}
      if(url.protocol !== 'https:') fail('source URL');
    }
    if(item.status === 'pending_review') {
      if(item.approval !== null) fail('pending proposal cannot have approval');
    } else {
      const approval=item.approval;
      if(!approval || !date(approval.decidedAt) || approval.decidedAt<item.discoveredAt || !text(approval.reference) || approval.decision !== (item.status === 'rejected' ? 'rejected' : 'approved')) fail('explicit decision evidence');
    }
  }
}
