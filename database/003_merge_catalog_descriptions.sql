-- Keep one current catalog description. Prior editorial variants stay in archive.
begin;
select pg_advisory_xact_lock(hashtext('academy-normalize-v2'));
lock table academy.catalog_facts in access exclusive mode;
alter view academy.catalog set schema academy_import_archive;
alter table academy.catalog_facts set schema academy_import_archive;
create trigger archive_read_only before insert or update or delete or truncate
on academy_import_archive.catalog_facts for each statement execute function academy_import_archive.prevent_changes();
create table academy.catalog_facts (
  entry_id text primary key references academy.entries(id),
  description text not null,
  language_support_summary text not null,
  repository_status text check(repository_status in ('not_applicable','unverified','verified')),
  repository_note text,
  reviewed_at timestamptz not null
);
insert into academy.catalog_facts
select entry_id,coalesce(compact_description,description),language_support_summary,
 repository_status,repository_note,reviewed_at from academy_import_archive.catalog_facts;
alter table academy.catalog_facts enable row level security;
revoke all on academy.catalog_facts from public;
create view academy.catalog with (security_invoker=true) as
select e.id,e.slug,e.name,e.kind,e.summary,g.priority as learning_priority,g.reason as learning_reason,
 f.description as catalog_description,f.language_support_summary,e.added_at,e.publication_status
from academy.entries e join academy.learning_guidance g on g.entry_id=e.id join academy.catalog_facts f on f.entry_id=e.id;
revoke all on academy.catalog from public;
do $$ begin
 if (select count(*) from academy.catalog_facts)<>(select count(*) from academy_import_archive.catalog_facts) then
  raise exception 'Catalog facts merge count mismatch';
 end if;
end $$;
insert into academy.schema_migrations(version,description) values(3,'One current catalog description; previous editorial variants are archive-only');
commit;
