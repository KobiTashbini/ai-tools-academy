import {readFileSync,writeFileSync} from 'node:fs';
import {additions} from '../database/seeds/agent-frameworks.mjs';
const evidence=JSON.parse(readFileSync(new URL('../database/evidence/agent-frameworks-2026-11-02.json',import.meta.url),'utf8'));
const q=v=>v==null?'null':typeof v==='number'?String(v):"'"+String(v).replaceAll("'","''")+"'";
const insert=(table,columns,values)=>`insert into academy.${table} (${columns}) values (${values.map(q).join(',')});`;
const sql=[`-- Reviewed content addition; official sources and timestamped GitHub evidence only.
begin;
select pg_advisory_xact_lock(hashtext('academy-migrations'));
do $$ begin
 if (select max(version) from academy.schema_migrations) is distinct from 5 then raise exception 'Expected schema version 5'; end if;
 if exists(select 1 from academy.entries where slug in (${additions.map(a=>q(a.slug)).join(',')}) or lower(name) in (${additions.map(a=>q(a.name.toLowerCase())).join(',')})) then raise exception 'Requested framework already exists; review instead of overwriting'; end if;
 if exists(select 1 from academy.repositories where url in (${evidence.map(a=>q(a.url)).join(',')})) then raise exception 'Repository already represented by another entry'; end if;
end $$;
create table academy.entry_lifecycle (
 entry_id text primary key references academy.entries(id),
 status text not null check(status='legacy'),
 note text not null check(length(trim(note))>0),
 successor_entry_id text not null references academy.entries(id),
 check(entry_id<>successor_entry_id)
);
alter table academy.entry_lifecycle enable row level security;
revoke all on academy.entry_lifecycle from public;`];
for(const a of additions){
 const e=evidence.find(e=>e.repo===a.repo); if(!e||!Number.isInteger(e.stars)||!Number.isFinite(Date.parse(e.commitDate)))throw Error('Invalid repository evidence');
 const scope=a.repo==='google/adk-python'?'Stars ופעילות של מאגר Python בלבד; אינם סכום מאגרי ADK בשפות השונות.':a.slug==='microsoft-autogen'?'המאגר ההיסטורי הרשמי של Microsoft AutoGen; Stars מצטברים אינם מעידים על תחזוקה פעילה.':'המאגר הרשמי של הפרויקט; Stars הם צילום מצב ולא מדד איכות או מספר משתמשים.';
 const sourceRows=[[a.docs,a.name+' — תיעוד רשמי','תפקיד, מבנה ותמיכת שפות; טענות על היעדר SDK מוגבלות למקורות שנבדקו.'],['https://github.com/'+a.repo,a.name+' — GitHub רשמי','זהות המאגר, קוד ומצב הפרויקט.'],[a.release.source,a.launchTitle,a.release.note],...(a.extraSources??[])];
 const sources=[...new Map(sourceRows.map(r=>[r[0],r])).values()];
 for(const url of new Set([...sources.map(s=>s[0]),e.starsSource,e.commitSource]))sql.push(`insert into academy.sources(url) values (${q(url)}) on conflict do nothing;`);
 sql.push(insert('entries','id,slug,name,kind,summary,publication_status,verification_status,verified_at,revision,revision_note,added_at,added_at_basis,discovered_at,approved_at,approval_reference',[a.slug,a.slug,a.name,'framework',a.summary,'published','verified','2026-11-02',1,'מקורות רשמיים נבדקו ב־2026-11-02; דוגמאות, תרגילים והשוואות מסומנים כפדגוגיים ולא הורצו. אין אימות מעבדתי לכל API.','2026-11-02','approved_proposal','2026-11-02','2026-11-02','User request 2026-11-02: add ADK, Mastra, smolagents, Agno and Legacy AutoGen; docs/DECISIONS.md D-029']));
 sql.push(insert('entry_categories','entry_id,category_id,position',[a.slug,'02',0]));
 sql.push(insert('entry_lessons','entry_id,prerequisites,example,exercise,language_support_note,alternatives_note',[a.slug,'היכרות עם REST/JSON, אימות קלט, לולאת tool calling והפרדת לוגיקה עסקית מהמודל.',a.example,a.exercise,a.languageSupportNote,a.alternativesNote]));
 a.sections.forEach(([title,body],i)=>sql.push(insert('entry_sections','entry_id,position,title,body',[a.slug,i,title,body])));
 sources.forEach(([url,title,supports],i)=>sql.push(insert('entry_sources','entry_id,position,source_url,title,checked_at,supports',[a.slug,i,url,title,'2026-11-02',supports])));
 a.related.forEach((slug,i)=>sql.push(`insert into academy.entry_relations(entry_id,related_entry_id,position) select ${q(a.slug)},id,${i} from academy.entries where slug=${q(slug)};`));
 sql.push(insert('learning_guidance','entry_id,priority,reason,reviewed_at,basis',[a.slug,a.priority,a.reason,'2026-11-02','editorial_learning']));
 sql.push(insert('catalog_facts','entry_id,description,language_support_summary,repository_status,repository_note,reviewed_at',[a.slug,a.description,a.languageSupportNote,'verified',scope,e.collectedAt]));
 a.languages.forEach((language,i)=>sql.push(insert('entry_language_labels','entry_id,position,label',[a.slug,i,language])));
 sql.push(insert('entry_releases','entry_id,release_year,release_date,precision,source_url,note',[a.slug,a.release.year,a.release.date,a.release.date?'day':'year',a.release.source,a.release.note]));
 sql.push(insert('repositories','url,entry_id,scope_note',[e.url,a.slug,scope]));
 sql.push(insert('repository_snapshots','repository_url,collected_at,stars,forks,source_url,last_activity_at,activity_source_url,branch,activity_method',[e.url,e.collectedAt,e.stars,e.forks,e.starsSource,e.commitDate,e.commitSource,e.branch,'default_branch_head_commit_committer_date']));
 if(a.legacyNote)sql.push(insert('entry_lifecycle','entry_id,status,note,successor_entry_id',[a.slug,'legacy',a.legacyNote,'microsoft-agent-framework']));
}
sql.push(`do $$ begin
 if (select count(*) from academy.entries where slug in (${additions.map(a=>q(a.slug)).join(',')}))<>5 then raise exception 'Framework import incomplete'; end if;
 if (select count(*) from academy.entry_relations where entry_id in (${additions.map(a=>q(a.slug)).join(',')}))<>${additions.reduce((n,a)=>n+a.related.length,0)} then raise exception 'Related framework missing'; end if;
end $$;
insert into academy.schema_migrations(version,description) values(6,'Four agent frameworks and historical AutoGen with sourced repository measurements and lifecycle');
commit;`);
writeFileSync(new URL('../database/006_add_agent_frameworks.sql',import.meta.url),sql.join('\n')+'\n');
console.log('Prepared migration 006: 5 entries; no cloud writes.');
