-- Historical presentation uses the existing lifecycle table. No status inferred from commit age.
begin isolation level serializable;
select pg_advisory_xact_lock(hashtext('academy-migrations'));
do $$ begin
 if (select max(version) from academy.schema_migrations) is distinct from 10 then raise exception 'Expected schema version 10'; end if;
 if not exists(select 1 from academy.entries where slug='flowise' and publication_status='archived' and revision=1) or not exists(select 1 from academy.entries where slug='openai-agent-builder' and publication_status='archived' and revision=1) then raise exception 'Historical baseline changed'; end if;
 if not exists(select 1 from academy.entry_lifecycle where entry_id='microsoft-autogen' and status='legacy' and successor_entry_id='microsoft-agent-framework') then raise exception 'AutoGen baseline changed'; end if;
end $$;
alter table academy.entry_lifecycle drop constraint entry_lifecycle_status_check;
alter table academy.entry_lifecycle add constraint entry_lifecycle_status_check check(status in ('legacy','maintenance','discontinued'));
alter table academy.entry_lifecycle alter column successor_entry_id drop not null;
alter table academy.entry_lifecycle add column source_url text references academy.sources(url);
alter table academy.entry_lifecycle add column checked_at date;
alter table academy.entry_lifecycle add column effective_at date;
alter table academy.entry_lifecycle add column date_label text;
alter table academy.entry_lifecycle add column scheduled_end_at date;
alter table academy.entry_lifecycle add constraint lifecycle_evidence check(
 (source_url is null and checked_at is null and effective_at is null and date_label is null and scheduled_end_at is null and status='legacy') or
 (source_url is not null and checked_at is not null and effective_at is not null and date_label is not null and length(trim(date_label))>0 and effective_at<=checked_at and (scheduled_end_at is null or scheduled_end_at>=effective_at))
);
alter table academy.entry_lifecycle add constraint discontinued_requires_source check(status<>'discontinued' or (source_url is not null and checked_at is not null and effective_at is not null));
insert into academy.sources(url) values ('https://github.com/microsoft/autogen'),('https://github.com/FlowiseAI/Flowise/discussions/6727'),('https://developers.openai.com/api/docs/deprecations#2026-06-03-agent-builder') on conflict do nothing;
update academy.entry_lifecycle set source_url='https://github.com/microsoft/autogen',checked_at='2026-11-03',effective_at='2026-11-03',date_label='אימות מצב המקור (מועד הארכוב המדויק לא אומת)' where entry_id='microsoft-autogen';
insert into academy.entry_lifecycle(entry_id,status,note,source_url,checked_at,effective_at,date_label) values
 ('flowise','discontinued','לפי הודעת הבעלים: הקפאת קוד29/07/2026, ארכוב13/08 ו־EOL31/08. אין תחזוקה רשמית ואין המלצה לפיתוח חדש. אין מחליפה רשמית מאומתת; החלופות הן אפשרויות לבחינה.','https://github.com/FlowiseAI/Flowise/discussions/6727','2026-11-03','2026-08-31','סיום חיים רשמי (EOL)');
insert into academy.entry_lifecycle(entry_id,status,note,source_url,checked_at,effective_at,date_label,scheduled_end_at) values
 ('openai-agent-builder','legacy','הוצא משימוש (Deprecated) ונמצא בחלון מעבר למשתמשים קיימים. הסגירה מתוכננת ל־30/11/2026; נכון לאימות אין טענה שכבר נסגר. ChatKit נשאר זמין.','https://developers.openai.com/api/docs/deprecations#2026-06-03-agent-builder','2026-11-03','2026-06-03','הודעת הוצאה משימוש','2026-11-30');
-- Keep publication and learning history intact; visibility is now lifecycle-aware.
insert into academy.schema_migrations(version,description) values(11,'Evidence-backed Legacy/Maintenance/Discontinued lifecycle with optional successor and historical discovery');
commit;
