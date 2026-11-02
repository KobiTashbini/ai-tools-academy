# Evidence and report contract

## Per-entry review

- Identity: canonical name, aliases, official owner, product/package/repository URLs, existing slug and revision where applicable. Distinguish concept, model, SDK/library, framework, protocol, runtime, platform, provider and hosted service using existing schema values; explain more precise roles in prose.
- Developer relevance: problem solved, enterprise use case, architecture, prerequisites, strengths, limits, closest existing alternatives and whether there is enough distinct learning value for a new record. Label proposed examples as unexecuted unless actually tested.
- Languages: official core implementation versus supported SDK/client versus HTTP interoperability; Python, TypeScript and especially C#/.NET. Verify feature parity and version constraints rather than infer support from the vendor name. Rust engine does not imply Rust API. Community clients must be identified as such; API access is not native SDK support.
- Freshness: current version/release channel, dated release and default-branch activity where available, archive/deprecation/maintenance notice and successor. Separate activity of a language implementation from the entire product. A recent commit alone does not prove support or security maintenance.
- Launch: official documented event (initial public release, package publication, beta, rename), source and precision (year or date). Keep product launch, repository creation, academic paper, major version, rebrand, catalog addition and source verification distinct. Do not invent a day from a known year.
- GitHub: canonical repository and measured Stars/Forks, collectedAt in UTC, archived flag, default branch, head SHA and commit timestamp/source when accessible. Keep metrics per repository, avoid adding related repos, SDKs or renamed aliases together. If rate limited, retain prior snapshot timestamp or mark unavailable; never refresh a timestamp without fetching its value. No repository is legitimate for concepts or closed services.
- Adoption: official surveys with year, population, denominator and method; downloads with ecosystem/time window; vendor claims labelled as claims. Stars are interest, downloads are not unique users, survey usage is not market share. Do not invent a composite score or change existing GitHub Interest cohorts/formula.
- Operational concerns: relevant license terms and editions, stability, privacy, authorization, cost and deployment burden. Do not promise performance, Hebrew OCR quality or security outcomes without applicable tests.
- Importance: current and proposed existing priority value with specific pedagogical rationale; explain uncertainty and comparison to simpler or already represented options. Popularity alone is insufficient to raise importance; failed access alone is insufficient to lower it.

For each material claim record: claim, observed value, supporting official URL/title, checkedAt (ISO timestamp with zone), event date if distinct, relevant version/edition, and confidence/limitations. Keep short permitted excerpts or factual summaries rather than copying whole pages. Conflicting sources remain visible with a reasoned resolution or an explicit unknown.

## Hebrew report structure

1. Report ID/version, date, requested scope, live baseline time/revisions, categories and actual checked/total counts. State if only published records were accessible; do not claim all-record duplicate checking in that case.
2. Category coverage: existing entries checked, discovery queries/official sources, missing roles and access gaps; use not applicable where appropriate.
3. Decision table: stable proposal ID, action (add/correct/merge/remove/Legacy/no change/defer), entry/category/type, current → proposed, learning importance/rationale, alternatives, confidence, sources and open questions. Separate observed facts from recommendations. Provide enough proposed values for meaningful approval.
4. Supporting evidence by claim, measurement timestamps, launch-event definitions and discrepancies. Propose only supported facts; missing data stays missing.
5. Review: who researched/reviewed what, material objections resolved or unresolved, tool failures and limitations; no claim of independent review without a separate reviewer.
6. Approval boundary: identify the report version/proposal IDs awaiting approval; no catalog edits have occurred. List deferred work explicitly. Do not mark proposals applied based only on approval.

Prefer source links adjacent to claims. Keep comparisons within equivalent roles and scope; a document parser, vector store and end-to-end RAG platform can complement each other rather than compete directly. Preserve the 12-category taxonomy and explain multi-category fit without generating duplicate entries.
