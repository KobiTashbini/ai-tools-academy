import {readFileSync,writeFileSync} from 'node:fs';
import {vectorAdditions,qdrantCorrection as correction,vectorGuide} from '../database/seeds/vector-databases.mjs';
const evidence=JSON.parse(readFileSync(new URL('../database/evidence/vector-databases-2026-11-02.json',import.meta.url),'utf8'));
const q=v=>v==null?'null':typeof v==='number'?String(v):"'"+String(v).replaceAll("'","''")+"'";
const insert=(table,columns,values)=>`insert into academy.${table} (${columns}) values (${values.map(q).join(',')});`;
const slugs=vectorAdditions.map(a=>q(a.slug)).join(',');
const sql=[`-- Approved vector05-20261102-v1, V05-01 through V05-08. Content only.
begin isolation level serializable;
select pg_advisory_xact_lock(hashtext('academy-migrations'));
do $$ begin
 if (select max(version) from academy.schema_migrations) is distinct from 8 then raise exception 'Expected schema version 8'; end if;
 if (select count(*) from academy.entries e join academy.entry_categories c on c.entry_id=e.id where c.category_id='05')<>1 then raise exception 'Category changed since review'; end if;
 if not exists(select 1 from academy.entries e join academy.entry_categories c on c.entry_id=e.id where e.slug='qdrant' and e.id='qdrant' and e.revision=2 and e.kind='database' and e.publication_status='published' and c.category_id='05') then raise exception 'Reviewed Qdrant changed'; end if;
 if (select count(*) from academy.entry_sections where entry_id='qdrant')<>5 or exists(select 1 from academy.entry_releases where entry_id='qdrant') then raise exception 'Reviewed Qdrant facts changed'; end if;
 if exists(select 1 from academy.entries where slug in (${slugs}) or lower(name) in (${vectorAdditions.map(a=>q(a.name.toLowerCase())).join(',')})) then raise exception 'Vector candidate already exists'; end if;
 if exists(select 1 from academy.repositories where url in (${vectorAdditions.filter(a=>a.repo).map(a=>q('https://github.com/'+a.repo)).join(',')})) then raise exception 'Candidate repository already represented'; end if;
 if exists(select 1 from academy.category_guides where category_id='05') then raise exception 'Existing guide requires review'; end if;
end $$;`];
function source(url){sql.push(`insert into academy.sources(url) values (${q(url)}) on conflict do nothing;`);}
function entrySource(slug,url,title,supports){source(url);sql.push(`insert into academy.entry_sources(entry_id,position,source_url,title,checked_at,supports) select e.id,coalesce((select max(position)+1 from academy.entry_sources where entry_id=e.id),0),${q(url)},${q(title)},'2026-11-02',${q(supports)} from academy.entries e where e.slug=${q(slug)} and not exists(select 1 from academy.entry_sources where entry_id=e.id and source_url=${q(url)});`);}
function release(a){if(!a.release)return;const r=a.release;source(r.source);sql.push(insert('entry_releases','entry_id,release_year,release_date,precision,source_url,note',[a.slug,r.year,r.date,r.date?'day':'year',r.source,r.note]));entrySource(a.slug,r.source,(a.name??a.slug)+' — אירוע פרסום',r.note);}
function snapshot(slug,repo,isNew){const e=evidence.find(e=>e.repo===repo);if(!e||e.archived||!e.commitSha||!e.commitDate)throw Error('Incomplete active-repo evidence');source(e.source);source(e.commitSource);if(isNew)sql.push(insert('repositories','url,entry_id,scope_note',[e.url,slug,'המאגר הראשי בלבד, ללא SDKs. Stars הם עניין, לא נתח שוק או איכות.']));sql.push(insert('repository_snapshots','repository_url,collected_at,stars,forks,source_url,last_activity_at,activity_source_url,branch,activity_method',[e.url,e.collectedAt,e.stars,e.forks,e.source,e.commitDate,e.commitSource,e.branch,'default_branch_head_commit_committer_date']));}
// Insert identities before relations between newly added chapters.
for(const a of vectorAdditions)sql.push(insert('entries','id,slug,name,kind,summary,publication_status,verification_status,verified_at,revision,revision_note,added_at,added_at_basis,discovered_at,approved_at,approval_reference',[a.slug,a.slug,a.name,a.kind,a.summary,'published','verified','2026-11-02',1,'יישום הדוח המאושר vector05-20261102-v1. מקורות רשמיים, דוגמאות ותרגילים מוצעים שלא הורצו; אין מדידת ביצועים או שוויון SDKs.','2026-11-02','approved_proposal','2026-11-02','2026-11-02','User approved vector05-20261102-v1 V05-01–V05-08 including Chroma and Qdrant corrections; docs/DECISIONS.md D-033']));
for(const a of vectorAdditions){
 const scope=a.repo?'המאגר הראשי של הפרויקט בלבד. צילום המחקר המאושר, לא דירוג איכות.':a.kind==='concept'?'פרק מושגים ללא מאגר מוצר מייצג.':'שירות מנוהל ללא מאגר ליבת מסד ציבורי מייצג; אין מדידה ממאגר SDK או דוגמאות.';
 sql.push(insert('entry_categories','entry_id,category_id,position',[a.slug,'05',0]));
 sql.push(insert('entry_lessons','entry_id,prerequisites,example,exercise,language_support_note,alternatives_note',[a.slug,'היכרות עם SQL, REST, אינדקסים והרשאות; לכלי מוצר מומלץ להתחיל ביסודות החיפוש הווקטורי.',a.example,a.exercise,a.languageSupportNote,a.alternativesNote]));
 a.sections.forEach(([title,body],i)=>sql.push(insert('entry_sections','entry_id,position,title,body',[a.slug,i,title,body])));
 sql.push(insert('learning_guidance','entry_id,priority,reason,reviewed_at,basis',[a.slug,a.priority,a.reason,'2026-11-02','editorial_learning']));
 sql.push(insert('catalog_facts','entry_id,description,language_support_summary,repository_status,repository_note,reviewed_at',[a.slug,a.description,a.languageSupportNote,a.repo?'verified':'not_applicable',scope,'2026-11-02']));
 a.languages.forEach((l,i)=>sql.push(insert('entry_language_labels','entry_id,position,label',[a.slug,i,l])));
 entrySource(a.slug,a.docs,a.name+' — תיעוד רשמי','תפקיד, זרימת עבודה ויכולות מתועדות; בחירה, דוגמאות ותרגילים הם ניתוח פדגוגי שלא הורץ.');
 for(const [url,title,note] of a.extraSources??[])entrySource(a.slug,url,title,note);
 if(a.repo){entrySource(a.slug,'https://github.com/'+a.repo,a.name+' — מאגר רשמי','זהות הפרויקט ותיעוד; מדדים נשמרים כתצפית נפרדת.');snapshot(a.slug,a.repo,true);}
 a.related.forEach((slug,i)=>sql.push(insert('entry_relations','entry_id,related_entry_id,position',[a.slug,slug,i])));
 release(a);
}
sql.push(`update academy.entries set summary=${q(correction.summary)},revision=revision+1,verified_at='2026-11-02',revision_note='תיקון מאושר V05-03: SDKs רשמיים, hybrid, דוגמת בחירה, אירוע v1.0 ומדידה; מקורות וסיווג קיימים נשמרו.' where slug='qdrant';
update academy.entry_lessons set example=${q(correction.example)},language_support_note=${q(correction.languageSupportNote)},alternatives_note=${q(correction.alternativesNote)} where entry_id='qdrant';
update academy.catalog_facts set description=${q(correction.description)},language_support_summary=${q(correction.languageSupportNote)},reviewed_at='2026-11-02' where entry_id='qdrant';
delete from academy.entry_language_labels where entry_id='qdrant';`);
correction.languages.forEach((l,i)=>sql.push(insert('entry_language_labels','entry_id,position,label',['qdrant',i,l])));
correction.sections.forEach(([title,body],i)=>sql.push(insert('entry_sections','entry_id,position,title,body',['qdrant',i+5,title,body])));
for(const [url,title,note] of correction.extraSources)entrySource('qdrant',url,title,note);
correction.related.forEach((slug,i)=>sql.push(`insert into academy.entry_relations(entry_id,related_entry_id,position) select 'qdrant',${q(slug)},coalesce((select max(position)+1 from academy.entry_relations where entry_id='qdrant'),0) where not exists(select 1 from academy.entry_relations where entry_id='qdrant' and related_entry_id=${q(slug)});`));
release(correction);snapshot('qdrant','qdrant/qdrant',false);
sql.push(insert('category_guides','category_id,title,introduction,note',['05',vectorGuide.title,vectorGuide.intro,vectorGuide.note]));
vectorGuide.steps.forEach(([id,text,label],i)=>sql.push(insert('category_guide_steps','category_id,position,entry_id,instruction,link_label',['05',i,id,text,label])));
sql.push(`do $$ begin
 if (select count(*) from academy.entries where slug in (${slugs}))<>7 then raise exception 'Incomplete vector additions'; end if;
 if (select count(*) from academy.entry_categories where category_id='05')<>8 then raise exception 'Expected eight vector entries'; end if;
 if (select revision from academy.entries where slug='qdrant')<>3 then raise exception 'Qdrant revision missing'; end if;
end $$;
insert into academy.schema_migrations(version,description) values(9,'Approved vector05-20261102-v1: foundations, six tools, Qdrant corrections and reading guide');
commit;`);
writeFileSync(new URL('../database/009_add_vector_databases.sql',import.meta.url),sql.join('\n')+'\n');
console.log('Prepared content migration 009; no cloud writes.');
