-- Archive must not depend on editable live records.
-- Dropping this derived view removes no stored data; its SQL is preserved in migration 002.
begin;
select pg_advisory_xact_lock(hashtext('academy-normalize-v2'));
drop view academy_import_archive.catalog;
alter table academy_import_archive.catalog_facts drop constraint catalog_facts_entry_id_fkey;
insert into academy.schema_migrations(version,description)
values(4,'Detach archive from editable live records; remove obsolete derived archive view');
commit;
