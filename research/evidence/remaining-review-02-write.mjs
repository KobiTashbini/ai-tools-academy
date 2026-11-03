import {writeFileSync} from 'node:fs';
const checkedAt=new Date().toISOString();
const rows=[
['MAF exact NuGet channel','Microsoft.Agents.AI1.27.0 no prerelease suffix; does not establish all extension maturity.','https://www.nuget.org/packages/Microsoft.Agents.AI'],
['MAF Go maturity','Go Public Preview with missing capabilities; distinguish from.NET package.','https://learn.microsoft.com/en-us/agent-framework/overview/'],
['Extensions image interface','IChatClient/IEmbeddingGenerator;IImageGenerator experimental.','https://learn.microsoft.com/en-us/dotnet/ai/microsoft-extensions-ai'],
['OpenAI SDK languages and responsibility','Python/TypeScript official; own server handles tools/state/deployment/approval.','https://developers.openai.com/api/docs/guides/agents/sdk'],
['Strands canonical redirect','sdk-python redirects harness-sdk containing separate harness and Python/TS SDKs.','https://github.com/strands-agents/sdk-python'],
['Mastra root license','Apache2 except ee directories and third-party components.','https://github.com/mastra-ai/mastra/blob/main/LICENSE.md'],
['Mastra enterprise production','Source-available ee production use requires written permission agreement plus validkey, development/testing separate.','https://github.com/mastra-ai/mastra/blob/main/ee/LICENSE'],
['Deep profiles language qualification','Python page opened; no explicit universal Python-only support exclusion established.','https://docs.langchain.com/oss/python/deepagents/profiles'],
['A2A official SDK list','Official SDK navigation links.NET.','https://a2a-protocol.org/latest/sdk/'],
['A2A C# source','Official server/client examples C#; no blanket GA assertion made.','https://github.com/a2aproject/a2a-dotnet'],
['ADK language list','Python/JS/Go/Java/Kotlin; current list noC#.','https://adk.dev/'],
['AutoGen conflicting README eras','Archived/no maintenance/no security fixes head; old maintenance paragraph remains later.','https://raw.githubusercontent.com/microsoft/autogen/main/README.md'],
['Pydantic durable engine contract','Eight engines; one peragent, journaling vs persistence separate.','https://pydantic.dev/docs/ai/capabilities/durable_execution/overview/'],
['Survey orchestration cohort','Used n4400, multiselect pastyear, ODbL1 StackExchange; usage not marketshare nor maintenance.','https://survey.stackoverflow.co/2026/ai/data/ai-orch']
];
writeFileSync('research/evidence/remaining-review-02-2026-11-03.json',JSON.stringify({reviewer:'remaining_coding01',reviewedReport:'agents02-20261103-v1',checkedAt,proposalsReviewed:13,existingCoverage:12,method:'Independent opening of official critical sources, full draft review and baseline identity/classification checks; no software/model calls.',claims:rows.map(([claim,observedValue,url])=>({claim,observedValue,url,title:claim,checkedAt,version:'current official artifact at research time',confidence:'high'})),correctionsRequested:['Mastra root source supplemented with ee/LICENSE production terms','DeepProfiles Python inspected; no unsupported TS absence claim','Add precise official survey cohort and limits instead of unverified-survey blanket'],blockingFindings:[],limitations:['Not every historical URL reopened; focused review of material changes','GitHub403; no new star/activity measurement inferred','Examples unexecuted; no performance/security/Hebrew-quality evidence']},null,2)+'\n');
console.log('Saved independent review evidence14claims.');
