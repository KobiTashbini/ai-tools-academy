import {readFileSync,writeFileSync} from 'node:fs';
import {visualAdditions,visualHistory,difyCorrection as correction,visualGuide} from '../database/seeds/visual-builders.mjs';
const baseline=JSON.parse(readFileSync(new URL('../research/evidence/visual06-baseline-2026-11-03.json',import.meta.url),'utf8'));
const evidence=JSON.parse(readFileSync(new URL('../research/evidence/visual06-github-retry-2026-11-03.json',import.meta.url),'utf8'));
const original=baseline.scope.find(r=>r.entry.slug==='dify');
if(baseline.identities.length!==57||baseline.scope.length!==1||original?.entry.revision!==2||baseline.guide!==null)throw Error('Unexpected frozen research baseline');
const q=v=>v==null?'null':typeof v==='number'?String(v):"'"+String(v).replaceAll("'","''")+"'";
const insert=(table,columns,values)=>`insert into academy.${table} (${columns}) values (${values.map(q).join(',')});`;
const additions=[...visualAdditions,...visualHistory];const slugs=additions.map(a=>q(a.slug)).join(',');
const sql=[`-- Approved visual06-20261103-v1 V06-01–V06-07 plus explicit historical-record request.
-- Content only. Archived historical records are excluded by the existing published-only loader.
begin isolation level serializable;
select pg_advisory_xact_lock(hashtext('academy-migrations'));
do $$ begin
 if (select max(version) from academy.schema_migrations) is distinct from 9 then raise exception 'Expected schema version 9'; end if;
 if (select count(*) from academy.entries)<>57 or (select count(*) from academy.entry_categories where category_id='06')<>1 then raise exception 'Catalog changed since review'; end if;
 if (select document from academy.entry_documents where slug='dify') is distinct from ${q(JSON.stringify(original.entry))}::jsonb then raise exception 'Reviewed Dify document changed'; end if;
 if exists(select 1 from academy.entries where id in (${slugs}) or slug in (${slugs}) or lower(name) in (${additions.map(a=>q(a.name.toLowerCase())).join(',')})) then raise exception 'Visual candidate already exists'; end if;
 if exists(select 1 from academy.repositories where url in ('https://github.com/langflow-ai/langflow','https://github.com/simstudioai/sim','https://github.com/FlowiseAI/Flowise')) then raise exception 'Candidate repository already represented'; end if;
 if exists(select 1 from academy.entry_releases where entry_id='dify') or exists(select 1 from academy.category_guides where category_id='06') then raise exception 'Reviewed facts or guide changed'; end if;
end $$;`];
const addSource=url=>sql.push(`insert into academy.sources(url) values (${q(url)}) on conflict do nothing;`);
function entrySource(slug,url,title,supports){addSource(url);sql.push(`insert into academy.entry_sources(entry_id,position,source_url,title,checked_at,supports) select e.id,coalesce((select max(position)+1 from academy.entry_sources where entry_id=e.id),0),${q(url)},${q(title)},'2026-11-03',${q(supports)} from academy.entries e where e.slug=${q(slug)} and not exists(select 1 from academy.entry_sources where entry_id=e.id and source_url=${q(url)});`);}
function release(a){if(!a.release)return;const r=a.release;addSource(r.source);sql.push(insert('entry_releases','entry_id,release_year,release_date,precision,source_url,note',[a.slug,r.year,r.date,r.date?'day':'year',r.source,r.note]));entrySource(a.slug,r.source,a.name+' — אירוע השקה',r.note);}
function snapshot(slug,repo,isNew){const e=evidence.repositories.find(e=>e.canonical===repo);if(!e||e.archived||!e.head?.sha||!e.collectedAt||!Number.isInteger(e.stars))throw Error('Incomplete active repository evidence');addSource(e.source);addSource(e.head.source);if(isNew)sql.push(insert('repositories','url,entry_id,scope_note',[e.repository,slug,'מאגר ליבת הפרויקט בלבד, ללא SDK או דוגמאות. Stars משקפים עניין מצטבר, לא שימוש פעיל, איכות או נתח שוק.']));sql.push(insert('repository_snapshots','repository_url,collected_at,stars,forks,source_url,last_activity_at,activity_source_url,branch,activity_method',[e.repository,e.collectedAt,e.stars,e.forks,e.source,e.head.date,e.head.source,e.defaultBranch,'default_branch_head_commit_committer_date']));entrySource(slug,e.repository,(slug==='dify'?'Dify':slug)+' — מאגר רשמי','זהות מאגר ליבה ופעילות; צילום המדידה נשמר בנפרד עם זמנו.');}
for(const a of additions)sql.push(insert('entries','id,slug,name,kind,summary,publication_status,verification_status,verified_at,revision,revision_note,added_at,added_at_basis,discovered_at,approved_at,approval_reference',[a.slug,a.slug,a.name,a.kind,a.summary,a.status??'published','verified','2026-11-03',1,a.status==='archived'?'תיעוד היסטורי מאושר בלבד; לא מומלץ לפיתוח חדש, מוסתר מהקטלוג הפעיל. תרחישי מעבר מוצעים ולא הורצו.':'יישום visual06-20261103-v1 המאושר. דוגמאות ותרגילים מוצעים שלא הורצו; אין הבטחת ביצועים, אבטחה או שוויון SDK.','2026-11-03','approved_proposal','2026-11-03','2026-11-03','User approved visual06-20261103-v1 V06-01–V06-07 and requested historical non-active Flowise/Agent Builder records; docs/DECISIONS.md D-035']));
for(const a of additions){
 sql.push(insert('entry_categories','entry_id,category_id,position',[a.slug,'06',0]));
 sql.push(insert('entry_lessons','entry_id,prerequisites,example,exercise,language_support_note,alternatives_note',[a.slug,'HTTP/JSON, אימות משתמש ויסודות LLM; לכלי מעשי מומלץ להתחיל בפרק יסודות הבנייה החזותית.',a.example,a.exercise,a.languageSupportNote,a.alternativesNote]));
 a.sections.forEach(([t,b],i)=>sql.push(insert('entry_sections','entry_id,position,title,body',[a.slug,i,t,b])));
 sql.push(insert('learning_guidance','entry_id,priority,reason,reviewed_at,basis',[a.slug,a.priority,a.reason,'2026-11-03','editorial_learning']));
 const scope=a.status==='archived'?'תיעוד היסטורי מוסתר; אין שימוש במדדי מאגר כהמלצת שימוש פעילה.':a.kind==='concept'?'פרק מושגים ללא מאגר מוצר מייצג.':a.repo?'מאגר הפרויקט הראשי בלבד; צילום מדידה מהמחקר המאושר.':'שירות Cloud ללא מאגר ליבה ציבורי מייצג; אין מדידה ממאגר SDK, v12 או כלי פיתוח.';
 sql.push(insert('catalog_facts','entry_id,description,language_support_summary,repository_status,repository_note,reviewed_at',[a.slug,a.description,a.languageSupportNote,a.repo?'verified':'not_applicable',scope,'2026-11-03']));
 a.languages.forEach((l,i)=>sql.push(insert('entry_language_labels','entry_id,position,label',[a.slug,i,l])));
 for(const [u,t,n] of a.sources)entrySource(a.slug,u,t,n);
 if(a.repo)snapshot(a.slug,a.repo,true);
 a.related.forEach((slug,i)=>sql.push(insert('entry_relations','entry_id,related_entry_id,position',[a.slug,slug,i])));
 release(a);
}
// Preserve the original Dify summary, sections, sources, identity, priority and addition history.
sql.push(`update academy.entries set revision=revision+1,verified_at='2026-11-03',revision_note='V06-02 מאושר: הרחבת דוגמה, יתרונות, חסרונות וחלופות, רישוי ופריסה; מקורות וסעיפים קודמים נשמרו. הדוגמאות לא הורצו.' where slug='dify';
update academy.entry_lessons set example=${q(correction.example)},exercise=${q(correction.exercise)},language_support_note=${q(correction.languageSupportNote)},alternatives_note=${q(correction.alternativesNote)} where entry_id='dify';
update academy.catalog_facts set language_support_summary=${q(correction.languageSupportNote)},reviewed_at='2026-11-03' where entry_id='dify';
delete from academy.entry_language_labels where entry_id='dify';`);
correction.languages.forEach((l,i)=>sql.push(insert('entry_language_labels','entry_id,position,label',['dify',i,l])));
correction.sections.forEach(([t,b],i)=>sql.push(insert('entry_sections','entry_id,position,title,body',['dify',original.entry.sections.length+i,t,b])));
for(const [u,t,n] of correction.sources)entrySource('dify',u,t,n);
correction.related.forEach(slug=>sql.push(`insert into academy.entry_relations(entry_id,related_entry_id,position) select 'dify',${q(slug)},coalesce((select max(position)+1 from academy.entry_relations where entry_id='dify'),0) where not exists(select 1 from academy.entry_relations where entry_id='dify' and related_entry_id=${q(slug)});`));
release({...correction,name:'Dify'});snapshot('dify','langgenius/dify',false);
sql.push(insert('category_guides','category_id,title,introduction,note',['06',visualGuide.title,visualGuide.intro,visualGuide.note]));
visualGuide.steps.forEach(([id,t,l],i)=>sql.push(insert('category_guide_steps','category_id,position,entry_id,instruction,link_label',['06',i,id,t,l])));
sql.push(`do $$ begin
 if (select count(*) from academy.entries where slug in (${slugs}))<>7 then raise exception 'Incomplete visual additions'; end if;
 if (select count(*) from academy.entry_categories c join academy.entries e on e.id=c.entry_id where c.category_id='06' and e.publication_status='published')<>6 then raise exception 'Expected six published visual entries'; end if;
 if (select count(*) from academy.entries where slug in ('flowise','openai-agent-builder') and publication_status='archived')<>2 then raise exception 'Historical records must remain archived'; end if;
 if (select revision from academy.entries where slug='dify')<>3 then raise exception 'Dify revision missing'; end if;
end $$;
insert into academy.schema_migrations(version,description) values(10,'Approved visual06-20261103-v1: foundations, four platforms, Dify improvements, guide and two archived historical tools');
commit;`);
writeFileSync(new URL('../database/010_add_visual_builders.sql',import.meta.url),sql.join('\n')+'\n');
writeFileSync(new URL('../database/evidence/visual-builders-2026-11-03.json',import.meta.url),JSON.stringify(evidence.repositories.filter(e=>['langgenius/dify','langflow-ai/langflow','simstudioai/sim'].includes(e.canonical)),null,2)+'\n');
console.log('Prepared content-only migration 010; no database writes.');
