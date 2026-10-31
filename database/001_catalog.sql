-- Run as database owner in the NEW Academy project only.
begin;
create schema academy;
revoke all on schema academy from public;
alter default privileges in schema academy revoke all on tables from public;

create table academy.import_batches (
  id text primary key,
  imported_at timestamptz not null default now(),
  description text not null
);
create table academy.source_documents (
  path text primary key,
  sha256 text not null check (sha256 ~ '^[a-f0-9]{64}$'),
  raw_text text not null,
  document jsonb not null,
  batch_id text not null references academy.import_batches(id)
);
create table academy.categories (
  id text primary key check (id ~ '^(0[0-9]|1[01])$'),
  name text not null,
  description text not null
);
create table academy.entries (
  id text primary key,
  slug text not null unique,
  name text not null,
  kind text not null check (kind in ('protocol','model','sdk','framework','platform','concept','product','database','runtime','orchestration_engine')),
  publication_status text not null check (publication_status in ('draft','in_review','published','archived')),
  verification_status text not null check (verification_status in ('unverified','verified','needs_review')),
  added_at date not null,
  revision integer not null check (revision > 0),
  payload jsonb not null check (jsonb_typeof(payload) = 'object')
);
create table academy.entry_categories (
  entry_id text not null references academy.entries(id),
  category_id text not null references academy.categories(id),
  primary key (entry_id, category_id)
);
create index on academy.entry_categories(category_id);
create table academy.entry_revisions (
  entry_id text not null references academy.entries(id),
  revision integer not null,
  payload jsonb not null,
  batch_id text not null references academy.import_batches(id),
  primary key(entry_id, revision)
);
create table academy.entry_sources (
  entry_id text not null,
  revision integer not null,
  position integer not null check (position >= 0),
  title text not null,
  url text not null check (url ~ '^https://'),
  checked_at date not null,
  supports text not null,
  primary key(entry_id, revision, position),
  foreign key(entry_id, revision) references academy.entry_revisions(entry_id, revision)
);
create table academy.entry_relations (
  entry_id text not null references academy.entries(id),
  related_slug text not null references academy.entries(slug),
  primary key(entry_id, related_slug)
);
create table academy.learning_guidance (
  entry_id text primary key references academy.entries(id),
  priority text not null check (priority in ('must_learn','should_know','enrichment')),
  reason text not null,
  reviewed_at date not null
);
create table academy.research_proposals (
  id text primary key,
  status text not null check (status in ('pending_review','approved','rejected','applied')),
  payload jsonb not null,
  batch_id text not null references academy.import_batches(id)
);
-- Private by default. No API exposure, anonymous access or write policies.
do $$ declare t record; begin
  for t in select tablename from pg_tables where schemaname = 'academy' loop
    execute format('alter table academy.%I enable row level security', t.tablename);
  end loop;
end $$;
revoke all on all tables in schema academy from public;
commit;
