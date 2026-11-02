import {readFileSync,writeFileSync} from 'node:fs';
import {reviewAdditions,reviewCorrections} from '../database/seeds/rag-review.mjs';
const evidence=JSON.parse(readFileSync(new URL('../database/evidence/rag-review-2026-11-02.json',import.meta.url),'utf8'));
const q=v=>v==null?'null':typeof v==='number'?String(v):"'"+String(v).replaceAll("'","''")+"'";
const ins=(t,c,v)=>`insert into academy.${t} (${c}) values (${v.map(q).join(',')});`;
const ids=reviewCorrections.map(a=>q(a.slug)).join(',');
const sql=[`-- Approved RAG research implementation. Data only; no DDL or archive writes.
begin isolation level serializable;
select pg_advisory_xact_lock(hashtext('academy-migrations'));
do $$ begin
 if (select max(version) from academy.schema_migrations) is distinct from 7 then raise exception 'Expected schema version 7'; end if;
 if (select count(*) from academy.entries e join academy.entry_categories c on c.entry_id=e.id where c.category_id='04' and e.slug in (${ids}))<>8 then raise exception 'Expected eight reviewed RAG entries'; end if;
 if exists(select 1 from academy.entries where slug in (${ids}) and revision<>case when slug='llamaindex' then 2 else 1 end) then raise exception 'Reviewed entries changed; reconcile before applying'; end if;
 if exists(select 1 from academy.entry_releases r join academy.entries e on e.id=r.entry_id where e.slug in (${ids})) then raise exception 'Release data changed since review'; end if;
 if exists(select 1 from academy.entries where slug in (${reviewAdditions.map(a=>q(a.slug)).join(',')}) or lower(name) in (${reviewAdditions.map(a=>q(a.name.toLowerCase())).join(',')})) then raise exception 'New RAG candidate already exists'; end if;
 if exists(select 1 from academy.repositories where url in (${reviewAdditions.map(a=>q('https://github.com/'+a.repo)).join(',')})) then raise exception 'Candidate repository already represented'; end if;
 if (select count(*) from academy.category_guide_steps where category_id='04')<>4 then raise exception 'Guide changed since review'; end if;
end $$;`];
function source(url){sql.push(`insert into academy.sources(url) values (${q(url)}) on conflict do nothing;`);}
function entrySource(slug,url,title,supports){source(url);sql.push(`insert into academy.entry_sources(entry_id,position,source_url,title,checked_at,supports)
 select e.id,coalesce((select max(position)+1 from academy.entry_sources where entry_id=e.id),0),${q(url)},${q(title)},'2026-11-02',${q(supports)} from academy.entries e where e.slug=${q(slug)} and not exists(select 1 from academy.entry_sources where entry_id=e.id and source_url=${q(url)});`);}
function release(a){if(a.release){const r=a.release;source(r.source);sql.push(ins('entry_releases','entry_id,release_year,release_date,precision,source_url,note',[a.slug,r.year,r.date,r.date?'day':'year',r.source,r.note]));entrySource(a.slug,r.source,a.name??a.slug+' — אירוע פרסום מתועד',r.note);}}
function snapshot(slug,repo,isNew){const e=evidence.find(e=>e.repo===repo);if(!e||e.archived)throw Error('Missing active-repo evidence');source(e.starsSource);source(e.commitSource);if(isNew)sql.push(ins('repositories','url,entry_id,scope_note',[e.url,slug,'המאגר הרשמי הראשי בלבד; Stars אינם מדד איכות או מספר משתמשים.']));sql.push(ins('repository_snapshots','repository_url,collected_at,stars,forks,source_url,last_activity_at,activity_source_url,branch,activity_method',[e.url,e.collectedAt,e.stars,e.forks,e.starsSource,e.commitDate,e.commitSource,e.branch,'default_branch_head_commit_committer_date']));}
for(const a of reviewAdditions){
 sql.push(ins('entries','id,slug,name,kind,summary,publication_status,verification_status,verified_at,revision,revision_note,added_at,added_at_basis,discovered_at,approved_at,approval_reference',[a.slug,a.slug,a.name,a.kind,a.summary,'published','verified','2026-11-02',1,'יישום מחקר שאושר ב־2026-11-02. דוגמאות ותרגילים פדגוגיים שלא הורצו; מדידות GitHub מצילום המחקר המקורי, לא מאיסוף חוזר.','2026-11-02','approved_proposal','2026-11-02','2026-11-02','User approved RAG research 2026-11-02: DSPy, txtai, Pathway and eight corrections; docs/DECISIONS.md D-031']));
 sql.push(ins('entry_categories','entry_id,category_id,position',[a.slug,'04',0]));
 sql.push(ins('entry_lessons','entry_id,prerequisites,example,exercise,language_support_note,alternatives_note',[a.slug,'היכרות עם REST/JSON, SQL, יסודות RAG, הרשאות והערכת תשובות.',a.example,a.exercise,a.languageSupportNote,a.alternativesNote]));
 a.sections.forEach(([title,body],i)=>sql.push(ins('entry_sections','entry_id,position,title,body',[a.slug,i,title,body])));
 sql.push(ins('learning_guidance','entry_id,priority,reason,reviewed_at,basis',[a.slug,a.priority,a.reason,'2026-11-02','editorial_learning']));
 sql.push(ins('catalog_facts','entry_id,description,language_support_summary,repository_status,repository_note,reviewed_at',[a.slug,a.description,a.languageSupportNote,'verified','המאגר הרשמי הראשי בלבד. מדידות מצילום המחקר המאושר מ־2026-11-02; אינן דירוג איכות.','2026-11-02']));
 a.languages.forEach((l,i)=>sql.push(ins('entry_language_labels','entry_id,position,label',[a.slug,i,l])));
 entrySource(a.slug,a.docs,a.name+' — תיעוד רשמי','תפקיד, ארכיטקטורה ושפות; יתרונות, חסרונות ודוגמאות הם ניתוח פדגוגי ולא Benchmark.');
 for(const [url,title,note] of a.extraSources??[])entrySource(a.slug,url,title,note);
 a.related.forEach((slug,i)=>sql.push(ins('entry_relations','entry_id,related_entry_id,position',[a.slug,slug,i])));
 release(a);snapshot(a.slug,a.repo,true);
}
const repoMap={'llamaindex':'run-llama/llama_index',haystack:'deepset-ai/haystack',ragflow:'infiniflow/ragflow',docling:'docling-project/docling',unstructured:'Unstructured-IO/unstructured','microsoft-graphrag':'microsoft/graphrag',lightrag:'HKUDS/LightRAG'};
for(const a of reviewCorrections){
 sql.push(`update academy.entries set revision=revision+1,verified_at='2026-11-02',revision_note='תיקון מחקר שאושר ב־2026-11-02: מקורות, אירועי פרסום, הבחנת שפות ומצב תחזוקה; הסיווג והפרסום נשמרו.'${a.summary?',summary='+q(a.summary):''} where slug=${q(a.slug)};`);
 if(a.languageSupportNote){sql.push(`update academy.entry_lessons set language_support_note=${q(a.languageSupportNote)} where entry_id=${q(a.slug)};`);sql.push(`update academy.catalog_facts set language_support_summary=${q(a.languageSupportNote)},reviewed_at='2026-11-02' where entry_id=${q(a.slug)};`);}
 if(a.languages){sql.push(`delete from academy.entry_language_labels where entry_id=${q(a.slug)};`);a.languages.forEach((l,i)=>sql.push(ins('entry_language_labels','entry_id,position,label',[a.slug,i,l])));}
 sql.push(`insert into academy.entry_sections(entry_id,position,title,body) select ${q(a.slug)},coalesce(max(position)+1,0),${q(a.section[0])},${q(a.section[1])} from academy.entry_sections where entry_id=${q(a.slug)};`);
 for(const [url,title,note] of a.extraSources??[])entrySource(a.slug,url,title,note);
 release(a);if(repoMap[a.slug])snapshot(a.slug,repoMap[a.slug],false);
}
sql.push(`update academy.category_guides set introduction='מתחילים ביסודות וב־baseline, בודקים הכנת מסמכים ושליפה, ואז בוחנים שיפור מדיד ועדכון מקורות. DSPy, txtai ו־Pathway מכסות תפקידים שונים; אין חובה לאמץ את כולן.',note='הסיווגים המקוריים נשמרו. Python, לקוחות HTTP ומימושים היסטוריים מופרדים; LlamaIndex.TS אינה תמיכה פעילה. מסדי מידע וקטוריים ב־05 והערכה ב־10, עם קישורים לכלים קיימים במקום כפילות.' where category_id='04';
update academy.category_guide_steps set entry_id='dspy',instruction='אחרי baseline מגדירים מדד ודוגמאות ובוחנים שיפור באמצעות DSPy.',link_label='לתכנות ואופטימיזציה של תהליכים' where category_id='04' and position=3;`);
const steps=[['txtai','משווים גישה משולבת לחיפוש, SQL ותהליכי מודלים.','לחיפוש משולב'],['pathway','כשמקורות משתנים, משווים עדכון אינקרמנטלי לאינדוקס תקופתי.','למידע משתנה ותנאי רישיון'],['microsoft-graphrag','רק לאחר בסיס מדיד בוחנים מה מוסיף גרף ומשווים ל־LightRAG.','להעמקה מבוססת גרף']];
steps.forEach(([id,text,label],i)=>sql.push(ins('category_guide_steps','category_id,position,entry_id,instruction,link_label',['04',i+4,id,text,label])));
sql.push(`do $$ begin
 if (select count(*) from academy.entries e join academy.entry_categories c on c.entry_id=e.id where c.category_id='04')<>11 then raise exception 'Expected eleven RAG entries'; end if;
 if (select count(*) from academy.entries where slug in (${ids}) and revision=case when slug='llamaindex' then 3 else 2 end)<>8 then raise exception 'Corrections incomplete'; end if;
end $$;
insert into academy.schema_migrations(version,description) values(8,'Approved RAG review: three additions and eight sourced corrections, existing classifications preserved');
commit;`);
writeFileSync(new URL('../database/008_apply_rag_review.sql',import.meta.url),sql.join('\n')+'\n');console.log('Prepared content migration 008; no cloud changes.');
