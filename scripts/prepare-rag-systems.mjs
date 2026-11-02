import {readFileSync,writeFileSync} from 'node:fs';
import {ragAdditions as additions} from '../database/seeds/rag-systems.mjs';
const evidence=JSON.parse(readFileSync(new URL('../database/evidence/rag-systems-2026-11-02.json',import.meta.url),'utf8'));
const q=v=>v==null?'null':typeof v==='number'?String(v):"'"+String(v).replaceAll("'","''")+"'";
const insert=(table,columns,values)=>`insert into academy.${table} (${columns}) values (${values.map(q).join(',')});`;
const slugs=additions.map(a=>q(a.slug)).join(',');
const sql=[`-- RAG content expansion only: no schema or existing-entry changes.
begin;
select pg_advisory_xact_lock(hashtext('academy-migrations'));
do $$ begin
 if (select max(version) from academy.schema_migrations) is distinct from 6 then raise exception 'Expected schema version 6'; end if;
 if exists(select 1 from academy.entries where slug in (${slugs}) or lower(name) in (${additions.map(a=>q(a.name.toLowerCase())).join(',')})) then raise exception 'RAG entry already exists'; end if;
 if exists(select 1 from academy.repositories where url in (${evidence.map(a=>q(a.url)).join(',')})) then raise exception 'RAG repository already represented'; end if;
 if exists(select 1 from academy.category_guides where category_id='04') then raise exception 'Review existing category guide'; end if;
 if (select count(*) from academy.entries where slug='llamaindex')<>1 then raise exception 'Existing LlamaIndex missing'; end if;
end $$;`];
// Insert all identities before relations, including links among the new chapters.
for(const a of additions)sql.push(insert('entries','id,slug,name,kind,summary,publication_status,verification_status,verified_at,revision,revision_note,added_at,added_at_basis,discovered_at,approved_at,approval_reference',[a.slug,a.slug,a.name,a.kind,a.summary,'published','verified','2026-11-02',1,'מקורות רשמיים נבדקו ב־2026-11-02. דוגמאות ותרגילים פדגוגיים מוצעים ולא הורצו; תאריכי השקה שלא אומתו נשארו חסרים.','2026-11-02','approved_proposal','2026-11-02','2026-11-02','User approval 2026-11-02: expand RAG category to eight entries; docs/DECISIONS.md D-030']));
for(const a of additions){
 const e=a.repo?evidence.find(e=>e.repo===a.repo):null;if(a.repo&&!e)throw Error('Missing evidence');
 const scope=e?'המאגר הרשמי של הפרויקט. Stars הם צילום מצב, ופעילות היא תאריך Commit בראש ברירת המחדל לפי UTC; אין ציון איכות או תפוצה.':'פרק מושגים, ללא מאגר מייצג או שנת השקה של מוצר.';
 const sources=[[a.docs,a.name+' — מקור רשמי','תפקיד, תהליך ושפות; הדוגמאות וההשוואות הן תכנון פדגוגי של האקדמיה.'],...(a.repo&&a.docs!=='https://github.com/'+a.repo?[['https://github.com/'+a.repo,a.name+' — מאגר רשמי','זהות הפרויקט, מימוש ותיעוד במאגר.']]:[])];
 for(const url of new Set([...sources.map(s=>s[0]),...(e?[e.starsSource,e.commitSource]:[])]))sql.push(`insert into academy.sources(url) values (${q(url)}) on conflict do nothing;`);
 sql.push(insert('entry_categories','entry_id,category_id,position',[a.slug,'04',0]));
 sql.push(insert('entry_lessons','entry_id,prerequisites,example,exercise,language_support_note,alternatives_note',[a.slug,a.kind==='concept'?'היכרות עם REST/JSON, SQL, הרשאות ומודל שפה.':'היכרות עם REST/JSON, SQL, הרשאות ומודל שפה. מומלץ להתחיל בפרק RAG — יסודות וארכיטקטורה.',a.example,a.exercise,a.languageSupportNote,a.alternativesNote]));
 a.sections.forEach(([title,body],i)=>sql.push(insert('entry_sections','entry_id,position,title,body',[a.slug,i,title,body])));
 sources.forEach(([url,title,supports],i)=>sql.push(insert('entry_sources','entry_id,position,source_url,title,checked_at,supports',[a.slug,i,url,title,'2026-11-02',supports])));
 a.related.forEach((slug,i)=>sql.push(`insert into academy.entry_relations(entry_id,related_entry_id,position) select ${q(a.slug)},id,${i} from academy.entries where slug=${q(slug)};`));
 sql.push(insert('learning_guidance','entry_id,priority,reason,reviewed_at,basis',[a.slug,a.priority,a.reason,'2026-11-02','editorial_learning']));
 sql.push(insert('catalog_facts','entry_id,description,language_support_summary,repository_status,repository_note,reviewed_at',[a.slug,a.description,a.languageSupportNote,e?'verified':'not_applicable',scope,e?.collectedAt??'2026-11-02']));
 a.languages.forEach((l,i)=>sql.push(insert('entry_language_labels','entry_id,position,label',[a.slug,i,l])));
 if(e){sql.push(insert('repositories','url,entry_id,scope_note',[e.url,a.slug,scope]));sql.push(insert('repository_snapshots','repository_url,collected_at,stars,forks,source_url,last_activity_at,activity_source_url,branch,activity_method',[e.url,e.collectedAt,e.stars,e.forks,e.starsSource,e.commitDate,e.commitSource,e.branch,'default_branch_head_commit_committer_date']));}
}
sql.push(insert('category_guides','category_id,title,introduction,note',['04','איך ללמוד מערכות RAG וידע?','מתקדמים מהארכיטקטורה להכנת מסמכים, להרכבת מערכת ורק אחר כך לשליפה מבוססת גרף. הסוגים בטבלה שונים: פרק מושגים, מסגרות, מערכת משולבת וכלי הכנת מסמכים.','מסדי נתונים וקטוריים נלמדים בקטגוריה 05; הערכה וניטור ב־10. גרף אינו דרישה לכל יישום RAG, וקריאת HTTP מ־.NET אינה SDK מקומי.']));
const steps=[['rag-fundamentals','תחילה מבינים מה מאנדקסים, איך שולפים הקשר ואיך בודקים מקורות.','ליסודות RAG'],['docling','בודקים איכות חילוץ ומבנה של מסמכים, ומשווים ל־Unstructured.','להכנת מסמכים'],['llamaindex','בונים baseline, ואז משווים ל־Haystack ולמערכת RAGFlow.','לפרק LlamaIndex הקיים'],['microsoft-graphrag','רק אחרי baseline בוחנים מה מוסיף גרף ומשווים ל־LightRAG.','להעמקה בשליפה מבוססת גרף']];
steps.forEach(([slug,text,label],i)=>sql.push(insert('category_guide_steps','category_id,position,entry_id,instruction,link_label',['04',i,slug,text,label])));
sql.push(`do $$ begin
 if (select count(*) from academy.entries where slug in (${slugs}))<>7 then raise exception 'RAG import incomplete'; end if;
 if (select count(*) from academy.entry_relations where entry_id in (${slugs}))<>${additions.reduce((n,a)=>n+a.related.length,0)} then raise exception 'RAG relation missing'; end if;
end $$;
insert into academy.schema_migrations(version,description) values(7,'Seven RAG chapters and reading guide; existing LlamaIndex preserved');
commit;`);
writeFileSync(new URL('../database/007_add_rag_systems.sql',import.meta.url),sql.join('\n')+'\n');console.log('Prepared content migration 007; no cloud writes.');
