-- Verified source: Stack Overflow Developer Survey 2026, LLMs / All Respondents.
-- Published percentages are retained as reported (not recalculated from counts).
begin;
select pg_advisory_xact_lock(hashtext('academy-migrations'));
do $$ begin
  if (select max(version) from academy.schema_migrations) is distinct from 4 then
    raise exception 'Expected schema version 4 before survey migration';
  end if;
end $$;

create table academy.developer_surveys (
  id text primary key,
  survey_year integer not null check(survey_year between 2000 and 2200),
  source_name text not null,
  source_url text not null references academy.sources(url),
  question text not null,
  population text not null,
  sample_size integer not null check(sample_size > 0),
  multiple_responses boolean not null,
  license_name text not null,
  license_url text not null check(license_url ~ '^https://'),
  verified_at date not null
);
create table academy.entry_survey_usage (
  survey_id text not null references academy.developer_surveys(id),
  entry_id text not null references academy.entries(id),
  provider_name text not null,
  usage_percent numeric(4,1) not null check(usage_percent between 0 and 100),
  respondent_count integer not null check(respondent_count >= 0),
  mapping_note text not null,
  primary key(survey_id,entry_id),
  unique(survey_id,provider_name)
);
alter table academy.developer_surveys enable row level security;
alter table academy.entry_survey_usage enable row level security;
revoke all on academy.developer_surveys, academy.entry_survey_usage from public;

insert into academy.sources(url) values ('https://survey.stackoverflow.co/2026/technology/data/llm') on conflict do nothing;
insert into academy.developer_surveys values (
  'so_2026_llm_all',2026,'Stack Overflow Developer Survey',
  'https://survey.stackoverflow.co/2026/technology/data/llm',
  'Which LLM model vendors for AI tools have you used for work in the past year? Which would you like to use next year? Select all that apply.',
  'All Respondents',11895,true,'ODbL 1.0','https://opendatacommons.org/licenses/odbl/1-0/','2026-11-02'
);
-- Provider-level observation mapped to the existing family entry, not a model version.
-- Microsoft is intentionally NOT mapped to Foundry (a hosting platform).
insert into academy.entry_survey_usage
select 'so_2026_llm_all',e.id,v.provider,v.percent,v.respondents,
  'Provider-level use mapped to the existing model-family entry; not use of a specific model version.'
from (values
  ('anthropic-claude','Anthropic',74.6,8871),
  ('openai-gpt','OpenAI',74.3,8834),
  ('google-gemini','Google AI',54.5,6483),
  ('deepseek','DeepSeek',18.9,2253),
  ('qwen','Alibaba Qwen',10.1,1203),
  ('mistral-ai','Mistral AI',9.8,1162),
  ('meta-llama','Meta AI',6.3,754)
) as v(slug,provider,percent,respondents)
join academy.entries e on e.slug=v.slug and e.kind='model'
join academy.entry_categories c on c.entry_id=e.id and c.category_id='07';
do $$ begin
  if (select count(*) from academy.entry_survey_usage where survey_id='so_2026_llm_all') <> 7 then
    raise exception 'Survey provider mapping incomplete';
  end if;
end $$;
insert into academy.schema_migrations(version,description) values(5,'Separate sourced developer-survey usage; seven verified provider mappings');
commit;
