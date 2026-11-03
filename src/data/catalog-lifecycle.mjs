// Shared public-catalog policy: never expose drafts or unclassified archives.
export function partitionCatalogEntries(entries) {
 const publicEntries=entries.filter(e=>e.publicationStatus==='published'||(e.publicationStatus==='archived'&&e.lifecycle));
 return {active:publicEntries.filter(e=>!e.lifecycle),historical:publicEntries.filter(e=>e.lifecycle)};
}
export function searchableEntries(catalog) {return [...catalog.entries,...(catalog.historicalEntries??[])];}
export function searchCatalogEntries(entries,query) {
 const terms=query.normalize('NFKC').toLocaleLowerCase('he').trim().split(/\s+/).filter(Boolean);
 if(!terms.length)return [];
 const {active,historical}=partitionCatalogEntries(entries);
 return [...active,...historical].filter(e=>{const haystack=[e.name,e.slug,e.summary,e.lifecycle?.note??'',e.lifecycle?.status??''].join(' ').normalize('NFKC').toLocaleLowerCase('he');return terms.every(t=>haystack.includes(t));});
}
export function activeAlternatives(entry,entries) {
 const slugs=new Set([entry.lifecycle?.successorSlug,...(entry.relatedSlugs??[])]);
 return partitionCatalogEntries(entries).active.filter(e=>e.kind!=='concept'&&slugs.has(e.slug));
}
