-- Read-only integrity checks. Integrity failure counters should be zero.
-- entries_changed_since_import is informational: approved additions/edits are
-- expected to differ from the immutable initial-import archive (5 after 006).
select 'entries' as check_name,count(*)::text as actual from academy.entries
union all select 'categories',count(*)::text from academy.categories
union all select 'lesson_sections',count(*)::text from academy.entry_sections
union all select 'learning_guidance',count(*)::text from academy.learning_guidance
union all select 'entry_sources',count(*)::text from academy.entry_sources
union all select 'repository_snapshots',count(*)::text from academy.repository_snapshots
union all select 'cohort_observations',count(*)::text from academy.cohort_observations
union all select 'package_metrics',count(*)::text from academy.package_metrics
union all select 'release_dates',count(*)::text from academy.entry_releases
union all select 'entries_changed_since_import',count(*)::text
 from academy.entry_documents n full join academy_import_archive.entries old using(id)
 where n.document is distinct from old.payload - array['priority','source','extraSources']
union all select 'damaged_archive_documents',count(*)::text from academy_import_archive.source_documents
 where sha256<>encode(sha256(convert_to(raw_text,'UTF8')),'hex') or document<>raw_text::jsonb
union all select 'live_json_columns',count(*)::text from information_schema.columns c
 join information_schema.tables t using(table_catalog,table_schema,table_name)
 where c.table_schema='academy' and t.table_type='BASE TABLE' and c.data_type in ('json','jsonb')
union all select 'tables_without_rls',count(*)::text from pg_class c join pg_namespace n on n.oid=c.relnamespace
 where n.nspname='academy' and c.relkind='r' and not c.relrowsecurity
union all select 'missing_archive_guards',count(*)::text from pg_class c join pg_namespace n on n.oid=c.relnamespace
 where n.nspname='academy_import_archive' and c.relkind='r' and not exists
 (select 1 from pg_trigger t where t.tgrelid=c.oid and t.tgname='archive_read_only' and t.tgenabled='O')
union all select 'migration_version',max(version)::text from academy.schema_migrations
union all select 'duplicate_catalog_description_columns',count(*)::text from information_schema.columns
 where table_schema='academy' and table_name='catalog_facts' and column_name='compact_description'
union all select 'archive_live_foreign_keys',count(*)::text from pg_constraint c
 join pg_class child on child.oid=c.conrelid join pg_namespace cn on cn.oid=child.relnamespace
 join pg_class parent on parent.oid=c.confrelid join pg_namespace pn on pn.oid=parent.relnamespace
 where c.contype='f' and cn.nspname='academy_import_archive' and pn.nspname='academy'
order by check_name;
