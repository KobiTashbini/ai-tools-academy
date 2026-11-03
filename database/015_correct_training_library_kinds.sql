-- Match approved F11-04, F11-05, F11-09: libraries/wrapper SDKs, not frameworks.
begin isolation level serializable;
select pg_advisory_xact_lock(hashtext('academy-migrations'));
do $$ begin
 if (select max(version) from academy.schema_migrations) is distinct from 14 then raise exception 'Expected schema version 14'; end if;
 if (select count(*) from academy.entries where slug in ('hf-datasets','hf-peft','torchsharp') and kind='framework' and revision=1 and publication_status='published')<>3 then raise exception 'Training classifications changed'; end if;
end $$;
update academy.entries set kind='sdk',revision=2,revision_note='תיקון סיווג לפי F11-04/F11-05/F11-09 המאושרות: ספריית נתונים, ספריית התאמה ומעטפת .NET. ללא שינוי תוכן או עדיפות.'
where slug in ('hf-datasets','hf-peft','torchsharp');
insert into academy.schema_migrations(version,description) values(15,'Correct approved Datasets, PEFT and TorchSharp library classifications to SDK');
commit;
