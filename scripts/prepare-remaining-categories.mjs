import {readFileSync,writeFileSync} from 'node:fs';
import {remainingAdditions as additions,remainingCorrections as corrections,remainingGuides as guides} from '../database/seeds/remaining-categories.mjs';
const read=n=>JSON.parse(readFileSync(new URL('../research/evidence/'+n,import.meta.url),'utf8'));
const baseline=read('remaining-baseline-2026-11-03.json');
const evidence=read('remaining-github-2026-11-03.json').repositories;
if(baseline.identities.length!==86||additions.length!==26||corrections.length!==13)throw Error('Unexpected approved scope');
const q=v=>v==null?'null':typeof v==='number'?String(v):"'"+String(v).replaceAll("'","''")+"'";
const sql=[],insert=(table,columns,values)=>sql.push(`insert into academy.${table} (${columns}) values (${values.map(q).join(',')});`);
const slugs=additions.map(a=>q(a.slug)).join(',');
sql.push(`-- 44 approved proposals. C01-10/F11-08 deferred. C01-08 identity reverified. Content only.
begin isolation level serializable;
select pg_advisory_xact_lock(hashtext('academy-migrations'));
do $$ begin
 if (select max(version) from academy.schema_migrations) is distinct from 13 then raise exception 'Expected schema version 13'; end if;
 if (select count(*) from academy.entries)<>86 then raise exception 'Catalog changed since review'; end if;
 if exists(select 1 from academy.entries where id in (${slugs}) or slug in (${slugs}) or lower(name) in (${additions.map(a=>q(a.name.toLowerCase())).join(',')})) then raise exception 'Candidate identity already exists'; end if;
 if exists(select 1 from academy.repositories where lower(url) in (${additions.filter(a=>a.repo).map(a=>q(('https://github.com/'+a.repo).toLowerCase())).join(',')})) then raise exception 'Candidate repository already represented'; end if;
 if exists(select 1 from academy.entries where lower(name) in ('windsurf','devin desktop','devin desktop / windsurf') or slug in ('windsurf','gemini-cli','wandb','wandb-models')) then raise exception 'Alias or deferred identity collision'; end if;
 if exists(select 1 from academy.repositories where lower(url)='https://github.com/strands-agents/sdk-python') then raise exception 'Strands alias already represented'; end if;
 if exists(select 1 from academy.category_guides where category_id in ('00','01','02','03','11')) then raise exception 'Reviewed guide changed'; end if;`);
for(const a of corrections){const s=baseline.scope.find(s=>s.entry.slug===a.slug);sql.push(` if (select document from academy.entry_documents where slug=${q(a.slug)}) is distinct from ${q(JSON.stringify(s.entry))}::jsonb then raise exception 'Reviewed document changed: ${a.slug}'; end if;`);}
sql.push('end $$;');
const source=url=>sql.push(`insert into academy.sources(url) values (${q(url)}) on conflict do nothing;`);
function entrySource(slug,url,title,supports){source(url);sql.push(`insert into academy.entry_sources(entry_id,position,source_url,title,checked_at,supports) select e.id,coalesce((select max(position)+1 from academy.entry_sources where entry_id=e.id),0),${q(url)},${q(title)},'2026-11-03',${q(supports)} from academy.entries e where e.slug=${q(slug)} and not exists(select 1 from academy.entry_sources where entry_id=e.id and source_url=${q(url)});`);}
for(const a of additions)insert('entries','id,slug,name,kind,summary,publication_status,verification_status,verified_at,revision,revision_note,added_at,added_at_basis,discovered_at,approved_at,approval_reference',[a.slug,a.slug,a.name,a.kind,a.summary,'published','verified','2026-11-03',1,'יישום מחקר מאושר; הפרדת מסלול מרכזי מחלופות. דוגמאות מוצעות שלא הורצו.','2026-11-03','approved_proposal','2026-11-03','2026-11-03',`User approved 30 core and 14 optional proposals; ${a.proposal}; C01-10/F11-08 deferred; C01-08 identity verified; D-039`]);
for(const a of additions){
 insert('entry_categories','entry_id,category_id,position',[a.slug,a.category,0]);
 insert('entry_lessons','entry_id,prerequisites,example,exercise,language_support_note,alternatives_note',[a.slug,'ידע בפיתוח תוכנה, HTTP, בדיקות והרשאות; קראו את פרק היסודות של הקטגוריה לפני בחירת מוצר.',a.example,a.exercise,a.languageSupportNote,a.alternativesNote]);
 a.sections.forEach(([t,b],i)=>insert('entry_sections','entry_id,position,title,body',[a.slug,i,t,b]));
 insert('learning_guidance','entry_id,priority,reason,reviewed_at,basis',[a.slug,a.priority,a.reason+(a.optional?' אופציונלי להשוואה או התמחות; אינו חלק אוטומטי מהמסלול המרכזי.':''),'2026-11-03','editorial_learning']);
 const observation=evidence.find(e=>e.canonical===a.repo&&Number.isInteger(e.stars));
 insert('catalog_facts','entry_id,description,language_support_summary,repository_status,repository_note,reviewed_at',[a.slug,a.description,a.languageSupportNote,a.repo?(observation?'verified':'unverified'):'not_applicable',a.repo?(a.repoScope??'זהות המאגר לפי המקור הרשמי; מדידה חסרה אינה אפס. אין head/latest מאומת מהמחקר.'):a.kind==='concept'?'פרק מושגי ללא מאגר מוצר.':'אין מאגר מוצר ציבורי מייצג שנבחר; אין ייחוס Stars של SDK לכל השירות.','2026-11-03']);
 a.languages.forEach((l,i)=>insert('entry_language_labels','entry_id,position,label',[a.slug,i,l]));for(const s of a.sources)entrySource(a.slug,...s);
 a.related.forEach((r,i)=>insert('entry_relations','entry_id,related_entry_id,position',[a.slug,r,i]));
 if(a.repo){insert('repositories','url,entry_id,scope_note',['https://github.com/'+a.repo,a.slug,a.repoScope??'מאגר הפרויקט בלבד; Stars אינם משתמשים, איכות או נתח שוק.']);if(observation){if(observation.archived)throw Error('Archived candidate');source(observation.source);insert('repository_snapshots','repository_url,collected_at,stars,forks,source_url',[observation.repository,observation.collectedAt,observation.stars,observation.forks,observation.source]);}}
}
for(const a of corrections){const old=baseline.scope.find(s=>s.entry.slug===a.slug).entry;
 sql.push(`update academy.entries set revision=revision+1,verified_at='2026-11-03',revision_note=${q('מחקר מאושר '+a.proposal+'; מקורות וסעיפים קודמים נשמרו. שפות, גבולות ורישוי תוקנו; דוגמאות לא הורצו.')} where slug=${q(a.slug)};
update academy.entry_lessons set example=${q(a.example)},exercise=${q(a.exercise)},language_support_note=${q(a.languageSupportNote)},alternatives_note=${q(a.alternativesNote)} where entry_id=${q(a.slug)};
update academy.catalog_facts set language_support_summary=${q(a.languageSupportNote)},reviewed_at='2026-11-03' where entry_id=${q(a.slug)};
delete from academy.entry_language_labels where entry_id=${q(a.slug)};`);
 a.languages.forEach((l,i)=>insert('entry_language_labels','entry_id,position,label',[a.slug,i,l]));a.sections.forEach(([t,b],i)=>insert('entry_sections','entry_id,position,title,body',[a.slug,old.sections.length+i,t,b]));for(const s of a.sources)entrySource(a.slug,...s);
 for(const r of a.related)sql.push(`insert into academy.entry_relations(entry_id,related_entry_id,position) select ${q(a.slug)},${q(r)},coalesce((select max(position)+1 from academy.entry_relations where entry_id=${q(a.slug)}),0) where not exists(select 1 from academy.entry_relations where entry_id=${q(a.slug)} and related_entry_id=${q(r)});`);
}
for(const [id,g] of Object.entries(guides)){insert('category_guides','category_id,title,introduction,note',[id,g.title,g.intro,g.note]);g.steps.forEach(([slug,t,l],i)=>insert('category_guide_steps','category_id,position,entry_id,instruction,link_label',[id,i,slug,t,l]));}
sql.push(`do $$ begin
 if (select count(*) from academy.entries)<>112 or (select count(*) from academy.entries where publication_status='published')<>110 then raise exception 'Unexpected final counts'; end if;
 if exists(select 1 from academy.category_guide_steps where category_id in ('00','01','02','03','11') and entry_id in (${additions.filter(a=>a.optional).map(a=>q(a.slug)).join(',')})) then raise exception 'Optional tool in central learning route'; end if;
end $$;
insert into academy.schema_migrations(version,description) values(14,'44 approved proposals: 26 additions, 13 corrections, five focused guides; two proposals deferred');
commit;`);
writeFileSync(new URL('../database/014_apply_remaining_categories.sql',import.meta.url),sql.join('\n')+'\n');
console.log('Prepared migration014; no database writes.');
