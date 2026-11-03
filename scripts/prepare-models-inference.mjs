import {readFileSync,writeFileSync} from 'node:fs';
import {modelsAdditions as additions,modelsCorrections as corrections,modelsGuides as guides} from '../database/seeds/models-inference.mjs';
const read=n=>JSON.parse(readFileSync(new URL('../research/evidence/'+n,import.meta.url),'utf8'));
const baseline=read('models0708-baseline-2026-11-03.json'),evidence=read('models0708-github-2026-11-03.json');
if(baseline.identities.length!==64||baseline.scope.length!==18||corrections.length!==18||additions.length!==7)throw Error('Unexpected approved scope');
const q=v=>v==null?'null':typeof v==='number'?String(v):"'"+String(v).replaceAll("'","''")+"'";
const sql=[],insert=(table,columns,values)=>sql.push(`insert into academy.${table} (${columns}) values (${values.map(q).join(',')});`);
const slugs=additions.map(a=>q(a.slug)).join(',');
sql.push(`-- Approved M07-01–18 and I08-01–09, with explicit user overrides. Content only.
begin isolation level serializable;
select pg_advisory_xact_lock(hashtext('academy-migrations'));
do $$ begin
 if (select max(version) from academy.schema_migrations) is distinct from 11 then raise exception 'Expected schema version 11'; end if;
 if (select count(*) from academy.entries)<>64 then raise exception 'Catalog changed since review'; end if;
 if exists(select 1 from academy.entries where id in (${slugs}) or slug in (${slugs}) or lower(name) in (${additions.map(a=>q(a.name.toLowerCase())).join(',')})) then raise exception 'Candidate identity already exists'; end if;
 if exists(select 1 from academy.repositories where url in (${additions.filter(a=>a.repo).map(a=>q('https://github.com/'+a.repo)).join(',')})) then raise exception 'Candidate repository already represented'; end if;`);
for(const s of baseline.scope)sql.push(` if (select document from academy.entry_documents where slug=${q(s.entry.slug)}) is distinct from ${q(JSON.stringify(s.entry))}::jsonb then raise exception 'Reviewed document changed: ${s.entry.slug}'; end if;`);
for(const [id,g] of Object.entries(baseline.guides))sql.push(` if (select jsonb_build_object('title',title,'intro',introduction,'note',note,'steps',(select jsonb_agg(jsonb_build_object('slug',e.slug,'text',s.instruction,'label',s.link_label) order by s.position) from academy.category_guide_steps s join academy.entries e on e.id=s.entry_id where s.category_id=g.category_id)) from academy.category_guides g where category_id=${q(id)}) is distinct from ${q(JSON.stringify(g))}::jsonb then raise exception 'Reviewed guide changed: ${id}'; end if;`);
sql.push('end $$;');
const source=url=>sql.push(`insert into academy.sources(url) values (${q(url)}) on conflict do nothing;`);
function entrySource(slug,url,title,supports){source(url);sql.push(`insert into academy.entry_sources(entry_id,position,source_url,title,checked_at,supports) select e.id,coalesce((select max(position)+1 from academy.entry_sources where entry_id=e.id),0),${q(url)},${q(title)},'2026-11-03',${q(supports)} from academy.entries e where e.slug=${q(slug)} and not exists(select 1 from academy.entry_sources where entry_id=e.id and source_url=${q(url)});`);}
for(const a of additions)insert('entries','id,slug,name,kind,summary,publication_status,verification_status,verified_at,revision,revision_note,added_at,added_at_basis,discovered_at,approved_at,approval_reference',[a.slug,a.slug,a.name,a.kind,a.summary,'published','verified','2026-11-03',1,'מחקר 07/08 מאושר; דוגמאות ותרגילים מוצעים שלא הורצו. אין טענת SDK, רישוי או ביצועים מעבר למקורות.','2026-11-03','approved_proposal','2026-11-03','2026-11-03','User approved models07-20261103-v1 M07-01–M07-18 and inference08-20261103-v1 I08-01–I08-09 with overrides; docs/DECISIONS.md D-037']);
for(const a of additions){
 insert('entry_categories','entry_id,category_id,position',[a.slug,a.category,0]);
 insert('entry_lessons','entry_id,prerequisites,example,exercise,language_support_note,alternatives_note',[a.slug,'HTTP/JSON, יסודות LLM; לפריסה יש לקרוא גם יסודות inference ורישיון checkpoint.',a.example,a.exercise,a.languageSupportNote,a.alternativesNote]);
 a.sections.forEach(([t,b],i)=>insert('entry_sections','entry_id,position,title,body',[a.slug,i,t,b]));
 insert('learning_guidance','entry_id,priority,reason,reviewed_at,basis',[a.slug,a.priority,a.reason,'2026-11-03','editorial_learning']);
 insert('catalog_facts','entry_id,description,language_support_summary,repository_status,repository_note,reviewed_at',[a.slug,a.description,a.languageSupportNote,a.repo?'verified':'not_applicable',a.repo?'מאגר ליבת הפרויקט; מדידת מחקר מתוארכת, ללא שינוי מדגמי Interest.':'אין מאגר מוצר יחיד מייצג; אין שיוך Stars של SDK למשפחת מודלים.','2026-11-03']);
 a.languages.forEach((l,i)=>insert('entry_language_labels','entry_id,position,label',[a.slug,i,l]));
 for(const s of a.sources)entrySource(a.slug,...s);
 a.related.forEach((r,i)=>insert('entry_relations','entry_id,related_entry_id,position',[a.slug,r,i]));
 if(a.repo){const e=evidence.repositories.find(e=>e.canonical===a.repo);if(!e||e.archived||!Number.isInteger(e.stars)||!e.head?.sha)throw Error('Incomplete repo evidence '+a.repo);source(e.source);source(e.head.source);insert('repositories','url,entry_id,scope_note',[e.repository,a.slug,'מאגר ליבת הפרויקט בלבד. Stars אינם מדד שימוש, איכות או נתח שוק.']);insert('repository_snapshots','repository_url,collected_at,stars,forks,source_url,last_activity_at,activity_source_url,branch,activity_method',[e.repository,e.collectedAt,e.stars,e.forks,e.source,e.head.date,e.head.source,e.defaultBranch,'default_branch_head_commit_committer_date']);}
}
for(const c of corrections){const original=baseline.scope.find(s=>s.entry.slug===c.slug)?.entry;if(!original)throw Error('Missing baseline');
 sql.push(`update academy.entries set revision=revision+1,verified_at='2026-11-03',revision_note='חבילת 07/08 מאושרת עם התאמות המשתמש; נוספו תיקונים, SDK/רישוי והבחנות תפעוליות. מקורות וסעיפים קודמים נשמרו. תרגילים לא הורצו.'${c.name?',name='+q(c.name):''} where slug=${q(c.slug)};
update academy.entry_lessons set example=${q(c.example)},exercise=${q(c.exercise)},language_support_note=${q(c.languageSupportNote)},alternatives_note=${q(c.alternativesNote)} where entry_id=${q(c.slug)};
update academy.catalog_facts set language_support_summary=${q(c.languageSupportNote)},reviewed_at='2026-11-03' where entry_id=${q(c.slug)};
delete from academy.entry_language_labels where entry_id=${q(c.slug)};`);
 c.languages.forEach((l,i)=>insert('entry_language_labels','entry_id,position,label',[c.slug,i,l]));
 c.sections.forEach(([t,b],i)=>insert('entry_sections','entry_id,position,title,body',[c.slug,original.sections.length+i,t,b]));
 for(const s of c.sources)entrySource(c.slug,...s);
 for(const r of c.related)sql.push(`insert into academy.entry_relations(entry_id,related_entry_id,position) select ${q(c.slug)},${q(r)},coalesce((select max(position)+1 from academy.entry_relations where entry_id=${q(c.slug)}),0) where not exists(select 1 from academy.entry_relations where entry_id=${q(c.slug)} and related_entry_id=${q(r)});`);
 sql.push(`update academy.learning_guidance set reviewed_at='2026-11-03'${c.priority?',priority='+q(c.priority)+',reason='+q(c.reason):''} where entry_id=${q(c.slug)};`);
}
for(const [id,g] of Object.entries(guides)){
 sql.push(`update academy.category_guides set title=${q(g.title)},introduction=${q(g.intro)},note=${q(g.note)} where category_id=${q(id)};delete from academy.category_guide_steps where category_id=${q(id)};`);
 g.steps.forEach(([slug,t,l],i)=>insert('category_guide_steps','category_id,position,entry_id,instruction,link_label',[id,i,slug,t,l]));
}
sql.push(`do $$ begin
 if (select count(*) from academy.entries)<>71 then raise exception 'Expected 71 records'; end if;
 if (select count(*) from academy.entries where publication_status='published')<>69 then raise exception 'Expected 69 published'; end if;
 if exists(select 1 from academy.entries where slug in (${corrections.map(c=>q(c.slug)).join(',')}) and revision<>3) then raise exception 'Missing corrections'; end if;
 if (select priority from academy.learning_guidance where entry_id='meta-llama')<>'must_learn' or (select priority from academy.learning_guidance where entry_id='qwen')<>'must_learn' or (select priority from academy.learning_guidance where entry_id='hugging-face')<>'should_know' then raise exception 'User priority override missing'; end if;
end $$;
insert into academy.schema_migrations(version,description) values(12,'Approved models07/inference08 research: seven additions, eighteen corrections, two learning guides and user overrides');
commit;`);
writeFileSync(new URL('../database/012_apply_models_inference.sql',import.meta.url),sql.join('\n')+'\n');
console.log('Prepared migration 012; no database writes.');
