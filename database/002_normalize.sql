-- Atomic migration from the initial import. No destructive deletes.
-- The old schema becomes a historical recovery snapshot, never an editing source.
begin;
select pg_advisory_xact_lock(hashtext('academy-normalize-v2'));
do $$ begin
  if exists(select 1 from information_schema.schemata where schema_name='academy_import_archive') then
    raise exception 'Normalization already applied or archive exists';
  end if;
end $$;
lock table academy.entries, academy.source_documents in access exclusive mode;
do $$ begin
  if exists(select 1 from academy.source_documents
    where sha256 <> encode(sha256(convert_to(raw_text,'UTF8')),'hex') or document <> raw_text::jsonb) then
    raise exception 'Source archive integrity check failed';
  end if;
  if exists(select 1 from academy.entries e cross join lateral jsonb_object_keys(e.payload) k
    where k not in ('id','slug','name','kind','summary','categoryIds','sections','example','exercise',
    'languageSupportNote','alternativesNote','publicationStatus','verificationStatus','verifiedAt',
    'revision','revisionNote','learningPriority','prerequisites','relatedSlugs','addedAt','addedAtBasis',
    'discoveredAt','approvedAt','approvalReference','priority','source','extraSources','sources')) then
    raise exception 'Unmapped entry field; review migration before proceeding';
  end if;
  if exists(select 1 from academy.research_proposals) then
    raise exception 'Nonempty research queue needs an explicit proposal migration';
  end if;
end $$;
alter schema academy rename to academy_import_archive;
comment on schema academy_import_archive is 'Historical initial import, retained for recovery only. Never edit or use as the live catalog.';
create schema academy;
revoke all on schema academy from public;
alter default privileges in schema academy revoke all on tables from public;
alter default privileges in schema academy revoke all on sequences from public;
alter default privileges in schema academy revoke execute on functions from public;

create table academy.schema_migrations (
  version integer primary key,
  applied_at timestamptz not null default now(),
  description text not null
);
create table academy.categories (
  id text primary key check(id ~ '^(0[0-9]|1[01])$'),
  name text not null check(length(trim(name))>0),
  description text not null
);
create table academy.entries (
  id text primary key,
  slug text not null unique check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check(length(trim(name))>0),
  kind text not null check(kind in ('protocol','model','sdk','framework','platform','concept','product','database','runtime','orchestration_engine')),
  summary text not null,
  publication_status text not null check(publication_status in ('draft','in_review','published','archived')),
  verification_status text not null check(verification_status in ('unverified','verified','needs_review')),
  verified_at date,
  revision integer not null check(revision>0),
  revision_note text not null,
  added_at date not null,
  added_at_basis text not null check(added_at_basis in ('historical_backfill','approved_proposal')),
  discovered_at date,
  approved_at date,
  approval_reference text,
  check(verification_status <> 'verified' or verified_at is not null),
  check(added_at_basis <> 'approved_proposal' or
    (discovered_at is not null and approved_at is not null and approval_reference is not null and length(trim(approval_reference))>0
     and discovered_at<=approved_at and approved_at<=added_at))
);
create table academy.entry_lessons (
  entry_id text primary key references academy.entries(id),
  prerequisites text,
  example text not null,
  exercise text not null,
  language_support_note text not null,
  alternatives_note text not null
);
create table academy.entry_sections (
  entry_id text not null references academy.entries(id),
  position integer not null check(position>=0),
  title text not null,
  body text not null,
  primary key(entry_id,position)
);
create table academy.entry_categories (
  entry_id text not null references academy.entries(id),
  category_id text not null references academy.categories(id),
  position integer not null check(position>=0),
  primary key(entry_id,category_id), unique(entry_id,position)
);
create index on academy.entry_categories(category_id);
create table academy.entry_relations (
  entry_id text not null references academy.entries(id),
  related_entry_id text not null references academy.entries(id),
  position integer not null check(position>=0),
  primary key(entry_id,related_entry_id), unique(entry_id,position),
  check(entry_id<>related_entry_id)
);
create index on academy.entry_relations(related_entry_id);
create table academy.sources (
  url text primary key check(url ~ '^https://')
);
create table academy.entry_sources (
  entry_id text not null references academy.entries(id),
  position integer not null check(position>=0),
  source_url text not null references academy.sources(url),
  title text not null,
  checked_at date not null,
  supports text not null,
  primary key(entry_id,position)
);
create index on academy.entry_sources(source_url);
create table academy.learning_guidance (
  entry_id text primary key references academy.entries(id),
  priority text not null check(priority in ('must_learn','should_know','enrichment')),
  reason text not null check(length(trim(reason))>0),
  reviewed_at date not null,
  basis text not null check(basis='editorial_learning')
);
create table academy.catalog_facts (
  entry_id text primary key references academy.entries(id),
  description text not null,
  language_support_summary text not null,
  compact_description text,
  repository_status text check(repository_status in ('not_applicable','unverified','verified')),
  repository_note text,
  reviewed_at timestamptz not null
);
-- These labels describe how integration is presented, not an inferred SDK matrix.
create table academy.entry_language_labels (
  entry_id text not null references academy.entries(id),
  position integer not null check(position>=0),
  label text not null,
  primary key(entry_id,label), unique(entry_id,position)
);
create table academy.entry_releases (
  entry_id text primary key references academy.entries(id),
  release_year integer not null check(release_year between 1900 and 2200),
  release_date date,
  precision text not null check(precision in ('day','year')),
  source_url text not null references academy.sources(url),
  note text not null,
  check((precision='year' and release_date is null) or
    (precision='day' and release_date is not null and extract(year from release_date)=release_year))
);
create table academy.repositories (
  url text primary key check(url ~ '^https://github.com/[^/]+/[^/]+$'),
  entry_id text not null unique references academy.entries(id),
  scope_note text not null
);
create table academy.repository_snapshots (
  repository_url text not null references academy.repositories(url),
  collected_at timestamptz not null,
  stars bigint not null check(stars>=0),
  forks bigint check(forks>=0),
  source_url text not null references academy.sources(url),
  last_activity_at timestamptz,
  activity_source_url text references academy.sources(url),
  branch text,
  activity_method text,
  primary key(repository_url,collected_at)
);
create table academy.metric_methods (
  id text primary key,
  name text not null,
  formula text,
  source_url text references academy.sources(url),
  note text
);
create table academy.metric_cohorts (
  id text primary key,
  method_id text not null references academy.metric_methods(id),
  label text,
  description text
);
create table academy.cohort_observations (
  cohort_id text not null references academy.metric_cohorts(id),
  repository_url text not null,
  collected_at timestamptz not null,
  primary key(cohort_id,repository_url,collected_at),
  foreign key(repository_url,collected_at) references academy.repository_snapshots(repository_url,collected_at)
);
-- External package measurements remain separate from local GitHub Interest.
create table academy.package_metrics (
  entry_id text not null references academy.entries(id),
  method_id text not null references academy.metric_methods(id),
  collected_at timestamptz not null,
  value numeric,
  request_status text not null,
  source_url text references academy.sources(url),
  reason text,
  package_name text,
  ecosystem text,
  measured_at timestamptz,
  package_repository_url text,
  repository_type text,
  repository_directory text,
  identity_source_url text references academy.sources(url),
  primary key(entry_id,method_id,collected_at),
  check(value is null or value>=0)
);
create table academy.category_guides (
  category_id text primary key references academy.categories(id),
  title text not null,
  introduction text not null,
  note text not null
);
create table academy.category_guide_steps (
  category_id text not null references academy.category_guides(category_id),
  position integer not null check(position>=0),
  entry_id text not null references academy.entries(id),
  instruction text not null,
  link_label text not null,
  primary key(category_id,position)
);
-- Future research uses explicit fields; initial queue must be empty (guard above).
create table academy.research_proposals (
  id text primary key,
  target_slug text not null,
  kind text not null check(kind in ('new_tool','learning_priority','source_update','metric_update')),
  status text not null default 'pending_review' check(status in ('pending_review','approved','rejected','applied')),
  title text not null,
  current_value text not null,
  proposed_value text not null,
  rationale text not null,
  tradeoffs text not null,
  confidence text not null check(confidence in ('low','medium','high')),
  discovered_at date not null,
  checked_at date not null,
  decision_at date,
  decision_reference text,
  check(discovered_at<=checked_at),
  check((status='pending_review' and decision_at is null and decision_reference is null) or
    (status<>'pending_review' and decision_at is not null and decision_reference is not null and length(trim(decision_reference))>0)),
  check(decision_at is null or decision_at>=discovered_at)
);
create table academy.proposal_sources (
  proposal_id text not null references academy.research_proposals(id),
  position integer not null check(position>=0),
  source_url text not null references academy.sources(url),
  title text not null,
  supports text not null,
  checked_at date not null,
  kind text not null check(kind in ('official','independent','vendor_claim')),
  primary key(proposal_id,position)
);
create table academy.proposal_categories (
  proposal_id text not null references academy.research_proposals(id),
  category_id text not null references academy.categories(id),
  primary key(proposal_id,category_id)
);

insert into academy.categories select * from academy_import_archive.categories;
insert into academy.entries
select id,slug,name,kind,payload->>'summary',publication_status,verification_status,
  (payload->>'verifiedAt')::date,revision,payload->>'revisionNote',added_at,payload->>'addedAtBasis',
  (payload->>'discoveredAt')::date,(payload->>'approvedAt')::date,payload->>'approvalReference'
from academy_import_archive.entries;
insert into academy.entry_lessons
select id,payload->>'prerequisites',payload->>'example',payload->>'exercise',
  payload->>'languageSupportNote',payload->>'alternativesNote' from academy_import_archive.entries;
insert into academy.entry_sections
select id,s.ordinality-1,s.value->>'title',s.value->>'text'
from academy_import_archive.entries cross join lateral jsonb_array_elements(payload->'sections') with ordinality s;
insert into academy.entry_categories
select id,c.value,c.ordinality-1 from academy_import_archive.entries
cross join lateral jsonb_array_elements_text(payload->'categoryIds') with ordinality c;
insert into academy.entry_relations
select old.id,target.id,r.ordinality-1 from academy_import_archive.entries old
cross join lateral jsonb_array_elements_text(old.payload->'relatedSlugs') with ordinality r
join academy.entries target on target.slug=r.value;
insert into academy.sources
select distinct url from academy_import_archive.entry_sources;
insert into academy.entry_sources
select entry_id,position,url,title,checked_at,supports from academy_import_archive.entry_sources;
insert into academy.learning_guidance
select g.entry_id,g.priority,g.reason,g.reviewed_at,d.document->>'basis'
from academy_import_archive.learning_guidance g
cross join academy_import_archive.source_documents d where d.path='content/learning-guidance.json';
insert into academy.catalog_facts
select e.id,f.value->>'description',f.value->>'languages',p.document->f.key->>'description',
 f.value->'github'->>'status',f.value->'github'->>'scope',(d.document->>'collectedAt')::timestamptz
from academy_import_archive.source_documents d
cross join lateral jsonb_each(d.document->'entries') f
join academy.entries e on e.slug=f.key
cross join academy_import_archive.source_documents p
where d.path='content/tool-facts.json' and p.path='content/category-02-presentation.json';
insert into academy.entry_language_labels
select e.id,l.ordinality-1,l.value
from academy.entries e
cross join academy_import_archive.source_documents normal
cross join academy_import_archive.source_documents pilot
cross join lateral jsonb_array_elements_text(coalesce(pilot.document->e.slug->'languages',normal.document->e.slug)) with ordinality l
where normal.path='content/catalog-presentation.json' and pilot.path='content/category-02-presentation.json';
insert into academy.sources
select distinct f.value->'release'->>'source' from academy_import_archive.source_documents d
cross join lateral jsonb_each(d.document->'entries') f
where d.path='content/tool-facts.json' and f.value ? 'release' on conflict do nothing;
insert into academy.entry_releases
select e.id,left(f.value->'release'->>'value',4)::int,
case when f.value->'release'->>'precision'='day' then (f.value->'release'->>'value')::date end,
f.value->'release'->>'precision',f.value->'release'->>'source',f.value->'release'->>'note'
from academy_import_archive.source_documents d cross join lateral jsonb_each(d.document->'entries') f
join academy.entries e on e.slug=f.key where d.path='content/tool-facts.json' and f.value ? 'release';
insert into academy.repositories
select r.value->>'url',e.id,r.value->>'scope'
from academy_import_archive.source_documents d cross join lateral jsonb_each(d.document) r
join academy.entries e on e.slug=r.key where d.path='content/github-snapshot.json';
insert into academy.sources
select r.value->>'starsSource' from academy_import_archive.source_documents d
cross join lateral jsonb_each(d.document) r where d.path='content/github-snapshot.json'
union select r.value->'lastActivity'->>'source' from academy_import_archive.source_documents d
cross join lateral jsonb_each(d.document) r where d.path='content/github-snapshot.json'
on conflict do nothing;
insert into academy.repository_snapshots
select r.value->>'url',(r.value->>'collectedAt')::timestamptz,(r.value->>'stars')::bigint,
(r.value->>'forks')::bigint,r.value->>'starsSource',(r.value->'lastActivity'->>'date')::timestamptz,
r.value->'lastActivity'->>'source',r.value->'lastActivity'->>'branch',r.value->'lastActivity'->>'method'
from academy_import_archive.source_documents d cross join lateral jsonb_each(d.document) r
where d.path='content/github-snapshot.json';
insert into academy.metric_methods values
 ('github_interest_v1','AI TOOLS GitHub Interest v1','50 * stars / maxStars + 50 * forks / maxForks',null,'Relative within its own cohort; not quality or user count'),
 ('source_rank','Libraries.io SourceRank',null,null,null),
 ('npms_popularity','npms popularity',null,null,'Historical package observation; not a current usage ranking');
insert into academy.sources
select distinct r.value->>'source' from academy_import_archive.source_documents d
cross join lateral jsonb_array_elements(d.document->'entries') r
where d.path in ('content/category-02-community-interest.json','content/inference-community-interest.json') on conflict do nothing;
insert into academy.metric_cohorts
select document->>'cohort','github_interest_v1',document->>'cohortLabel',document->>'description'
from academy_import_archive.source_documents
where path in ('content/category-02-community-interest.json','content/inference-community-interest.json');
insert into academy.repository_snapshots(repository_url,collected_at,stars,forks,source_url)
select r.value->>'repository',(d.document->>'collectedAt')::timestamptz,
(r.value->>'stars')::bigint,(r.value->>'forks')::bigint,r.value->>'source'
from academy_import_archive.source_documents d cross join lateral jsonb_array_elements(d.document->'entries') r
where d.path in ('content/category-02-community-interest.json','content/inference-community-interest.json')
on conflict(repository_url,collected_at) do update set forks=excluded.forks
where academy.repository_snapshots.stars=excluded.stars and academy.repository_snapshots.source_url=excluded.source_url;
insert into academy.cohort_observations
select d.document->>'cohort',r.value->>'repository',(d.document->>'collectedAt')::timestamptz
from academy_import_archive.source_documents d cross join lateral jsonb_array_elements(d.document->'entries') r
where d.path in ('content/category-02-community-interest.json','content/inference-community-interest.json');
insert into academy.sources
select r.value->>'source' from academy_import_archive.source_documents d
cross join lateral jsonb_array_elements(d.document->'sourceRank') r
where d.path='content/category-02-metric-snapshot.json' and r.value ? 'source'
union select document->'popularity'->>'source' from academy_import_archive.source_documents where path='content/category-02-metric-snapshot.json'
union select document->'popularity'->>'identitySource' from academy_import_archive.source_documents where path='content/category-02-metric-snapshot.json'
union select document->'popularity'->>'source' from academy_import_archive.source_documents where path='content/tool-facts.json'
on conflict do nothing;
insert into academy.metric_methods
select 'oss_compass_v3',document->'popularity'->>'algorithm',null,document->'popularity'->>'source',document->'popularity'->>'reason'
from academy_import_archive.source_documents where path='content/tool-facts.json';
insert into academy.package_metrics(entry_id,method_id,collected_at,value,request_status,source_url,reason,package_name,ecosystem,measured_at,package_repository_url)
select e.id,'source_rank',(d.document->>'collectedAt')::timestamptz,(r.value->>'rank')::numeric,
r.value->>'status',r.value->>'source',r.value->>'reason',r.value->>'name',r.value->>'platform',
(r.value->>'updatedAt')::timestamptz,r.value->>'repository'
from academy_import_archive.source_documents d cross join lateral jsonb_array_elements(d.document->'sourceRank') r
join academy.entries e on e.slug=r.value->>'slug' where d.path='content/category-02-metric-snapshot.json';
insert into academy.package_metrics(entry_id,method_id,collected_at,value,request_status,source_url,package_name,measured_at,package_repository_url,repository_type,repository_directory,identity_source_url)
select e.id,'npms_popularity',(d.document->>'collectedAt')::timestamptz,(p->>'score')::numeric,
'200',p->>'source',p->>'package',(p->>'analyzedAt')::timestamptz,p->'repository'->>'url',
p->'repository'->>'type',p->'repository'->>'directory',p->>'identitySource'
from academy_import_archive.source_documents d cross join lateral (select d.document->'popularity' p) x
join academy.entries e on e.slug=p->>'slug' where d.path='content/category-02-metric-snapshot.json';
insert into academy.category_guides
select g.key,g.value->>'title',g.value->>'intro',g.value->>'note'
from academy_import_archive.source_documents d cross join lateral jsonb_each(d.document) g where d.path='content/category-guides.json';
insert into academy.category_guide_steps
select g.key,s.ordinality-1,e.id,s.value->>'text',s.value->>'label'
from academy_import_archive.source_documents d cross join lateral jsonb_each(d.document) g
cross join lateral jsonb_array_elements(g.value->'steps') with ordinality s
join academy.entries e on e.slug=s.value->>'slug' where d.path='content/category-guides.json';

-- Views reconstruct convenient read models without storing duplicate content.
create view academy.entry_documents with (security_invoker=true) as
select e.id,e.slug,
 jsonb_build_object('id',e.id,'slug',e.slug,'name',e.name,'kind',e.kind,'summary',e.summary,
 'publicationStatus',e.publication_status,'verificationStatus',e.verification_status,'verifiedAt',e.verified_at,
 'revision',e.revision,'revisionNote',e.revision_note,'addedAt',e.added_at,'addedAtBasis',e.added_at_basis,
 'example',l.example,'exercise',l.exercise,'languageSupportNote',l.language_support_note,'alternativesNote',l.alternatives_note,
 'learningPriority',g.priority,
 'categoryIds',(select jsonb_agg(category_id order by position) from academy.entry_categories c where c.entry_id=e.id),
 'sections',(select jsonb_agg(jsonb_build_object('title',title,'text',body) order by position) from academy.entry_sections s where s.entry_id=e.id),
 'sources',(select jsonb_agg(jsonb_build_object('title',title,'url',source_url,'checkedAt',checked_at,'supports',supports) order by position) from academy.entry_sources s where s.entry_id=e.id))
 || case when l.prerequisites is not null then jsonb_build_object('prerequisites',l.prerequisites) else '{}'::jsonb end
 || case when exists(select 1 from academy.entry_relations r where r.entry_id=e.id) then
 jsonb_build_object('relatedSlugs',(select jsonb_agg(t.slug order by r.position) from academy.entry_relations r join academy.entries t on t.id=r.related_entry_id where r.entry_id=e.id)) else '{}'::jsonb end
 || case when e.discovered_at is not null then jsonb_build_object('discoveredAt',e.discovered_at) else '{}'::jsonb end
 || case when e.approved_at is not null then jsonb_build_object('approvedAt',e.approved_at) else '{}'::jsonb end
 || case when e.approval_reference is not null then jsonb_build_object('approvalReference',e.approval_reference) else '{}'::jsonb end as document
from academy.entries e join academy.entry_lessons l on l.entry_id=e.id join academy.learning_guidance g on g.entry_id=e.id;
create view academy.catalog with (security_invoker=true) as
select e.id,e.slug,e.name,e.kind,e.summary,g.priority as learning_priority,g.reason as learning_reason,
 f.description as catalog_description,f.compact_description,f.language_support_summary,e.added_at,e.publication_status
from academy.entries e join academy.learning_guidance g on g.entry_id=e.id join academy.catalog_facts f on f.entry_id=e.id;
create view academy.community_interest with (security_invoker=true) as
select o.cohort_id,r.entry_id,o.collected_at,
 round((50.0*s.stars/nullif(max(s.stars) over(partition by o.cohort_id,o.collected_at),0)
 +50.0*s.forks/nullif(max(s.forks) over(partition by o.cohort_id,o.collected_at),0))::numeric,2) as score
from academy.cohort_observations o join academy.repository_snapshots s using(repository_url,collected_at)
join academy.repositories r on r.url=o.repository_url;

-- Abort the whole migration if the normalized content is not equivalent.
do $$ begin
  if (select count(*) from academy.entries)<>(select count(*) from academy_import_archive.entries)
    or (select count(*) from academy.categories)<>(select count(*) from academy_import_archive.categories) then
    raise exception 'Catalog count mismatch';
  end if;
  if exists(select 1 from academy.entry_documents n join academy_import_archive.entries old using(id)
    where n.document <> old.payload - array['priority','source','extraSources']) then
    raise exception 'Normalized entry differs from imported content';
  end if;
  if exists(select 1 from academy_import_archive.source_documents d
    cross join lateral jsonb_array_elements(d.document->'entries') r
    join academy.repository_snapshots s on s.repository_url=r.value->>'repository' and s.collected_at=(d.document->>'collectedAt')::timestamptz
    where d.path in ('content/category-02-community-interest.json','content/inference-community-interest.json')
    and (s.stars<>(r.value->>'stars')::bigint or s.forks is distinct from (r.value->>'forks')::bigint)) then
    raise exception 'Cohort measurements mismatch';
  end if;
end $$;
do $$ declare t record; begin
  for t in select tablename from pg_tables where schemaname='academy' loop
    execute format('alter table academy.%I enable row level security',t.tablename);
  end loop;
end $$;
revoke all on all tables in schema academy from public;
revoke all on all sequences in schema academy from public;
revoke all on schema academy_import_archive from public;
-- Archive is immutable for ordinary owner-level SQL too; DDL owner can explicitly recover it.
create function academy_import_archive.prevent_changes() returns trigger
language plpgsql set search_path=pg_catalog as $$ begin
 raise exception 'Historical import archive is read-only';
end $$;
revoke execute on function academy_import_archive.prevent_changes() from public;
do $$ declare t record; begin
 for t in select tablename from pg_tables where schemaname='academy_import_archive' loop
  execute format('create trigger archive_read_only before insert or update or delete or truncate on academy_import_archive.%I for each statement execute function academy_import_archive.prevent_changes()',t.tablename);
 end loop;
end $$;
insert into academy.schema_migrations(version,description) values(2,'Normalized catalog; one editable location per field; immutable initial-import archive');
commit;
