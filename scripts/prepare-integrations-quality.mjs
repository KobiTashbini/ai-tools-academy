import {readFileSync,writeFileSync} from 'node:fs';
import {integrationsAdditions as additions,integrationsCorrections as corrections,integrationsGuides as guides} from '../database/seeds/integrations-quality.mjs';
const read=n=>JSON.parse(readFileSync(new URL('../research/evidence/'+n,import.meta.url),'utf8'));
const baseline=read('integrations0910-baseline-2026-11-03.json');
const evidence=[...read('integrations0910-github-2026-11-03.json').repositories,...read('integrations0910-otel-github-2026-11-03.json').repositories];
if(baseline.identities.length!==71||baseline.scope.length!==2||additions.length!==15||corrections.length!==2)throw Error('Unexpected approved scope');
const q=v=>v==null?'null':typeof v==='number'?String(v):"'"+String(v).replaceAll("'","''")+"'";
const sql=[],insert=(table,columns,values)=>sql.push(`insert into academy.${table} (${columns}) values (${values.map(q).join(',')});`);
const slugs=additions.map(a=>q(a.slug)).join(',');
sql.push(`-- Approved T09-01–09 and Q10-01–10; Langfuse keeps must_learn. Content only.
begin isolation level serializable;
select pg_advisory_xact_lock(hashtext('academy-migrations'));
do $$ begin
 if (select max(version) from academy.schema_migrations) is distinct from 12 then raise exception 'Expected schema version 12'; end if;
 if (select count(*) from academy.entries)<>71 then raise exception 'Catalog changed since review'; end if;
 if exists(select 1 from academy.entries where id in (${slugs}) or slug in (${slugs}) or lower(name) in (${additions.map(a=>q(a.name.toLowerCase())).join(',')})) then raise exception 'Candidate identity already exists'; end if;
 if exists(select 1 from academy.repositories where url in (${additions.filter(a=>a.repo).map(a=>q('https://github.com/'+a.repo)).join(',')})) then raise exception 'Candidate repository already represented'; end if;
 if exists(select 1 from academy.category_guides where category_id in ('09','10')) then raise exception 'Reviewed guide changed'; end if;`);
for(const s of baseline.scope)sql.push(` if (select document from academy.entry_documents where slug=${q(s.entry.slug)}) is distinct from ${q(JSON.stringify(s.entry))}::jsonb then raise exception 'Reviewed document changed: ${s.entry.slug}'; end if;`);
sql.push('end $$;');
const source=url=>sql.push(`insert into academy.sources(url) values (${q(url)}) on conflict do nothing;`);
function entrySource(slug,url,title,supports){source(url);sql.push(`insert into academy.entry_sources(entry_id,position,source_url,title,checked_at,supports) select e.id,coalesce((select max(position)+1 from academy.entry_sources where entry_id=e.id),0),${q(url)},${q(title)},'2026-11-03',${q(supports)} from academy.entries e where e.slug=${q(slug)} and not exists(select 1 from academy.entry_sources where entry_id=e.id and source_url=${q(url)});`);}
for(const a of additions)insert('entries','id,slug,name,kind,summary,publication_status,verification_status,verified_at,revision,revision_note,added_at,added_at_basis,discovered_at,approved_at,approval_reference',[a.slug,a.slug,a.name,a.kind,a.summary,'published','verified','2026-11-03',1,'יישום מחקר09/10 המאושר; הבחנת ליבה, השוואה והתמחות. דוגמאות ותרגילים מוצעים שלא הורצו; רישוי ותמיכה לפי רכיב.','2026-11-03','approved_proposal','2026-11-03','2026-11-03','User approved integrations09-20261103-v1 T09-01–09 and quality10-20261103-v1 Q10-01–10; Langfuse must_learn override; docs/DECISIONS.md D-038']);
for(const a of additions){
 insert('entry_categories','entry_id,category_id,position',[a.slug,a.category,0]);
 insert('entry_lessons','entry_id,prerequisites,example,exercise,language_support_note,alternatives_note',[a.slug,a.category==='09'?'HTTP/JSON, DTO והרשאות; קראו יסודות כלים לפני חיבור כלי עסקי.':'בדיקות תוכנה, לוגים והרשאות; קראו יסודות איכות ואבטחה לפני בחירת פלטפורמה.',a.example,a.exercise,a.languageSupportNote,a.alternativesNote]);
 a.sections.forEach(([t,b],i)=>insert('entry_sections','entry_id,position,title,body',[a.slug,i,t,b]));
 insert('learning_guidance','entry_id,priority,reason,reviewed_at,basis',[a.slug,a.priority,a.reason,'2026-11-03','editorial_learning']);
 insert('catalog_facts','entry_id,description,language_support_summary,repository_status,repository_note,reviewed_at',[a.slug,a.description,a.languageSupportNote,a.repo?'verified':'not_applicable',a.repo?(a.repoScope??'מאגר ליבת הפרויקט בלבד; מדידת מחקר מתוארכת אינה מדד שימוש או איכות.'):a.kind==='concept'?'פרק מושגי ללא מאגר מוצר מייצג.':'אין מאגר מוצר ציבורי יחיד מייצג; אין שיוך Stars של SDK או monorepo רחב לשירות או לחבילה.','2026-11-03']);
 a.languages.forEach((l,i)=>insert('entry_language_labels','entry_id,position,label',[a.slug,i,l]));for(const s of a.sources)entrySource(a.slug,...s);
 a.related.forEach((r,i)=>insert('entry_relations','entry_id,related_entry_id,position',[a.slug,r,i]));
 if(a.repo){const e=evidence.find(e=>e.canonical===a.repo);if(!e||e.archived||!Number.isInteger(e.stars)||!e.head?.sha)throw Error('Incomplete evidence '+a.repo);source(e.source);source(e.head.source);insert('repositories','url,entry_id,scope_note',[e.repository,a.slug,a.repoScope??'מאגר ליבת הפרויקט בלבד; Stars ו־Forks הם עניין במאגר, לא משתמשים, איכות או נתח שוק.']);insert('repository_snapshots','repository_url,collected_at,stars,forks,source_url,last_activity_at,activity_source_url,branch,activity_method',[e.repository,e.collectedAt,e.stars,e.forks,e.source,e.head.date,e.head.source,e.defaultBranch,'default_branch_head_commit_committer_date']);}
}
for(const c of corrections){const old=baseline.scope.find(s=>s.entry.slug===c.slug).entry;
 sql.push(`update academy.entries set revision=revision+1,verified_at='2026-11-03',revision_note='מחקר09/10 מאושר עם הבחנת מסלול מרכזי וחלופות; נשמרה חשיבות חובה. פרקים ומקורות קודמים נשמרו; דוגמאות לא הורצו.' where slug=${q(c.slug)};
update academy.entry_lessons set example=${q(c.example)},exercise=${q(c.exercise)},language_support_note=${q(c.languageSupportNote)},alternatives_note=${q(c.alternativesNote)} where entry_id=${q(c.slug)};
update academy.catalog_facts set language_support_summary=${q(c.languageSupportNote)},reviewed_at='2026-11-03' where entry_id=${q(c.slug)};
update academy.learning_guidance set reason=${q(c.reason)},reviewed_at='2026-11-03' where entry_id=${q(c.slug)};
delete from academy.entry_language_labels where entry_id=${q(c.slug)};`);
 c.languages.forEach((l,i)=>insert('entry_language_labels','entry_id,position,label',[c.slug,i,l]));c.sections.forEach(([t,b],i)=>insert('entry_sections','entry_id,position,title,body',[c.slug,old.sections.length+i,t,b]));for(const s of c.sources)entrySource(c.slug,...s);
 for(const r of c.related)sql.push(`insert into academy.entry_relations(entry_id,related_entry_id,position) select ${q(c.slug)},${q(r)},coalesce((select max(position)+1 from academy.entry_relations where entry_id=${q(c.slug)}),0) where not exists(select 1 from academy.entry_relations where entry_id=${q(c.slug)} and related_entry_id=${q(r)});`);
}
for(const [id,g] of Object.entries(guides)){insert('category_guides','category_id,title,introduction,note',[id,g.title,g.intro,g.note]);g.steps.forEach(([slug,t,l],i)=>insert('category_guide_steps','category_id,position,entry_id,instruction,link_label',[id,i,slug,t,l]));}
sql.push(`do $$ begin
 if (select count(*) from academy.entries)<>86 or (select count(*) from academy.entries where publication_status='published')<>84 then raise exception 'Unexpected final counts'; end if;
 if (select count(*) from academy.entry_categories where category_id='09')<>8 or (select count(*) from academy.entry_categories where category_id='10')<>9 then raise exception 'Unexpected category counts'; end if;
 if exists(select 1 from academy.learning_guidance where entry_id in ('langfuse','mcp') and priority<>'must_learn') then raise exception 'Must-learn priorities must be preserved'; end if;
 if exists(select 1 from academy.entries where slug in ('langfuse','mcp') and revision<>3) then raise exception 'Missing corrections'; end if;
end $$;
insert into academy.schema_migrations(version,description) values(13,'Approved T09/Q10: fifteen additions, two corrections and two learning guides; keep Langfuse must_learn');
commit;`);
writeFileSync(new URL('../database/013_apply_integrations_quality.sql',import.meta.url),sql.join('\n')+'\n');
console.log('Prepared content migration013; no database writes.');
