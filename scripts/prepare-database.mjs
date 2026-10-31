import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { assembleEntries } from '../src/data/assemble-entries.mjs';
import { validateContent } from '../src/data/validate-content.mjs';
import { validateProposals } from '../src/data/validate-proposals.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const hash = value => createHash('sha256').update(value).digest('hex');
// UTF-8 hex literals avoid SQL injection, quote escaping and dollar-quote collisions.
const str = value => `convert_from(decode('${Buffer.from(String(value)).toString('hex')}','hex'),'UTF8')`;
const json = value => `${str(JSON.stringify(value))}::jsonb`;
const insert = (table, columns, values) => `insert into academy.${table} (${columns.join(',')}) values (${values.join(',')});`;

export function prepareDatabase(base = root) {
  const paths = [...readdirSync(resolve(base, 'content')).filter(p => p.endsWith('.json')).map(p => `content/${p}`), 'research/proposals.json'].sort();
  const documents = paths.map(path => {
    const raw = readFileSync(resolve(base, path), 'utf8');
    return { path, raw, sha256: hash(raw), document: JSON.parse(raw) };
  });
  const read = path => documents.find(d => d.path === path).document;
  const categories = read('content/categories.json');
  const entries = assembleEntries(read('content/entries.json'), read('content/lessons.json'));
  validateContent(categories, entries);
  const queue = read('research/proposals.json');
  validateProposals(queue, entries, categories);
  const guidance = read('content/learning-guidance.json');
  const batch = hash(documents.map(d => `${d.path}:${d.sha256}`).join('\n'));
  const lines = ['begin;', "select pg_advisory_xact_lock(hashtext('academy-initial-import'));",
    // Seed is deliberately one-shot: never silently overwrite cloud edits on rerun.
    "do $$ begin if exists (select 1 from academy.import_batches) or exists (select 1 from academy.entries) or exists (select 1 from academy.categories) then raise exception 'Academy initial import requires an empty catalog; no data was changed'; end if; end $$;",
    insert('import_batches', ['id','description'], [str(batch),str('Initial import from validated local JSON; no invented historical revisions')])];
  for (const d of documents) lines.push(insert('source_documents', ['path','sha256','raw_text','document','batch_id'], [str(d.path),str(d.sha256),str(d.raw),json(d.document),str(batch)]));
  for (const c of categories) lines.push(insert('categories', ['id','name','description'], [str(c.id),str(c.name),str(c.description)]));
  for (const e of entries) {
    if (!guidance.reasons[e.slug] || !e.learningPriority) throw Error(`Missing learning guidance: ${e.slug}`);
    lines.push(insert('entries', ['id','slug','name','kind','publication_status','verification_status','added_at','revision','payload'], [str(e.id),str(e.slug),str(e.name),str(e.kind),str(e.publicationStatus),str(e.verificationStatus),str(e.addedAt)+'::date',e.revision,json(e)]));
    lines.push(insert('entry_revisions', ['entry_id','revision','payload','batch_id'], [str(e.id),e.revision,json(e),str(batch)]));
    for (const id of e.categoryIds) lines.push(insert('entry_categories', ['entry_id','category_id'], [str(e.id),str(id)]));
    for (const [position,s] of e.sources.entries()) lines.push(insert('entry_sources', ['entry_id','revision','position','title','url','checked_at','supports'], [str(e.id),e.revision,position,str(s.title),str(s.url),str(s.checkedAt)+'::date',str(s.supports)]));
    lines.push(insert('learning_guidance', ['entry_id','priority','reason','reviewed_at'], [str(e.id),str(e.learningPriority),str(guidance.reasons[e.slug]),str(guidance.reviewedAt)+'::date']));
  }
  for (const e of entries) for (const slug of e.relatedSlugs ?? []) lines.push(insert('entry_relations', ['entry_id','related_slug'], [str(e.id),str(slug)]));
  for (const p of queue.proposals) lines.push(insert('research_proposals', ['id','status','payload','batch_id'], [str(p.id),str(p.status),json(p),str(batch)]));
  lines.push('commit;');
  return { sql: lines.join('\n'), documents, entries, categories, batch };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const data = prepareDatabase();
  const output = resolve(root, 'database/generated');
  mkdirSync(output, { recursive:true });
  writeFileSync(resolve(output, 'initial-import.sql'), data.sql);
  writeFileSync(resolve(output, 'manifest.json'), JSON.stringify({ batch:data.batch, entries:data.entries.length, categories:data.categories.length, documents:data.documents.map(({path,sha256}) => ({path,sha256})) }, null, 2));
  console.log(`Prepared historical bootstrap: ${data.entries.length} entries, ${data.categories.length} categories, ${data.documents.length} source documents. No cloud connection was made. For a NEW database only: apply 001, this seed, then migrations 002-004. Never reimport into the existing cloud project.`);
}
