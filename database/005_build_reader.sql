-- Read-only identity for exporting the published catalog at build time.
-- Grants SELECT on exactly what the export reads; RLS limits rows to published entries.
-- No research queue, no archive, no write access. The login password is set separately
-- (see database/README.md) and is never stored in this repository.
begin;
select pg_advisory_xact_lock(hashtext('academy-normalize-v2'));
do $$ begin
  if not exists (select 1 from academy.schema_migrations where version=4) then
    raise exception 'Apply migrations 002-004 before 005';
  end if;
  if exists (select 1 from academy.schema_migrations where version=5) then
    raise exception 'Migration 005 was already applied';
  end if;
  if not exists (select 1 from pg_roles where rolname='academy_build_reader') then
    create role academy_build_reader nologin;
  end if;
end $$;

grant usage on schema academy to academy_build_reader;
grant select on
  academy.categories, academy.entries, academy.entry_lessons, academy.entry_sections,
  academy.entry_categories, academy.entry_relations, academy.entry_sources, academy.learning_guidance,
  academy.catalog_facts, academy.entry_language_labels, academy.entry_releases,
  academy.repositories, academy.repository_snapshots, academy.metric_methods, academy.metric_cohorts,
  academy.cohort_observations, academy.package_metrics, academy.category_guides, academy.category_guide_steps,
  academy.entry_documents
to academy_build_reader;

-- Shared reference data.
create policy build_reader_read on academy.categories for select to academy_build_reader using (true);
create policy build_reader_read on academy.metric_methods for select to academy_build_reader using (true);
create policy build_reader_read on academy.metric_cohorts for select to academy_build_reader using (true);
create policy build_reader_read on academy.category_guides for select to academy_build_reader using (true);

-- Only published entries are visible; every entry-owned row follows its entry.
-- The subqueries on academy.entries are themselves filtered by the policy below.
create policy build_reader_read on academy.entries for select to academy_build_reader
  using (publication_status='published');
create policy build_reader_read on academy.entry_lessons for select to academy_build_reader
  using (exists (select 1 from academy.entries e where e.id=entry_id));
create policy build_reader_read on academy.entry_sections for select to academy_build_reader
  using (exists (select 1 from academy.entries e where e.id=entry_id));
create policy build_reader_read on academy.entry_categories for select to academy_build_reader
  using (exists (select 1 from academy.entries e where e.id=entry_id));
create policy build_reader_read on academy.entry_relations for select to academy_build_reader
  using (exists (select 1 from academy.entries e where e.id=entry_id)
     and exists (select 1 from academy.entries e where e.id=related_entry_id));
create policy build_reader_read on academy.entry_sources for select to academy_build_reader
  using (exists (select 1 from academy.entries e where e.id=entry_id));
create policy build_reader_read on academy.learning_guidance for select to academy_build_reader
  using (exists (select 1 from academy.entries e where e.id=entry_id));
create policy build_reader_read on academy.catalog_facts for select to academy_build_reader
  using (exists (select 1 from academy.entries e where e.id=entry_id));
create policy build_reader_read on academy.entry_language_labels for select to academy_build_reader
  using (exists (select 1 from academy.entries e where e.id=entry_id));
create policy build_reader_read on academy.entry_releases for select to academy_build_reader
  using (exists (select 1 from academy.entries e where e.id=entry_id));
create policy build_reader_read on academy.package_metrics for select to academy_build_reader
  using (exists (select 1 from academy.entries e where e.id=entry_id));
create policy build_reader_read on academy.category_guide_steps for select to academy_build_reader
  using (exists (select 1 from academy.entries e where e.id=entry_id));
create policy build_reader_read on academy.repositories for select to academy_build_reader
  using (exists (select 1 from academy.entries e where e.id=entry_id));
create policy build_reader_read on academy.repository_snapshots for select to academy_build_reader
  using (exists (select 1 from academy.repositories r where r.url=repository_url));
create policy build_reader_read on academy.cohort_observations for select to academy_build_reader
  using (exists (select 1 from academy.repositories r where r.url=repository_url));

insert into academy.schema_migrations(version,description)
values(5,'Read-only build reader for the published catalog export');
commit;
