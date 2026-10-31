-- Reversible recovery without deleting either schema. Stops if live content was edited.
begin;
select pg_advisory_xact_lock(hashtext('academy-normalize-v2'));
lock table academy.entries in access exclusive mode;
do $$ begin
 if exists(select 1 from academy.entry_documents n full join academy_import_archive.entries old using(id)
   where n.document is distinct from old.payload - array['priority','source','extraSources']) then
   raise exception 'Live content changed; reconcile before rollback';
 end if;
end $$;
alter schema academy rename to academy_normalized_rollback;
alter schema academy_import_archive rename to academy;
do $$ declare t record; begin
 for t in select tablename from pg_tables where schemaname='academy' loop
  execute format('alter table academy.%I disable trigger archive_read_only',t.tablename);
 end loop;
end $$;
commit;
