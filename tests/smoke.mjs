import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { Pool } from "pg";
import { readDatabaseCatalog } from "../src/data/database-catalog.mjs";
import { additions } from "../database/seeds/agent-frameworks.mjs";
import { ragAdditions } from "../database/seeds/rag-systems.mjs";
import { reviewAdditions, reviewCorrections } from "../database/seeds/rag-review.mjs";
import { vectorAdditions, qdrantCorrection } from "../database/seeds/vector-databases.mjs";

import { visualAdditions, visualHistory, difyCorrection, visualGuide } from "../database/seeds/visual-builders.mjs";
import { modelsAdditions, modelsCorrections, modelsGuides } from "../database/seeds/models-inference.mjs";
import { integrationsAdditions, integrationsCorrections, integrationsGuides } from "../database/seeds/integrations-quality.mjs";

if (!process.env.DATABASE_URL && existsSync('.env.local')) process.loadEnvFile('.env.local');
const base = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3000";
const pool = new Pool({connectionString:process.env.DATABASE_URL,connectionTimeoutMillis:10000});
let catalog;
try {const client=await pool.connect();try{catalog=await readDatabaseCatalog(client);}finally{client.release();}}
catch {throw new Error('Smoke catalog read failed; verify database connection and migrations');}
finally {await pool.end();}
const entries = catalog.entries;
const historicalEntries = [...entries.filter(e=>e.lifecycle),...catalog.historicalEntries];
const discoverableEntries = [...entries,...catalog.historicalEntries];
const frameworkEvidence=JSON.parse(readFileSync(new URL('../database/evidence/agent-frameworks-2026-11-02.json',import.meta.url),'utf8'));
for(const addition of additions) assert.equal(entries.filter(e=>e.slug===addition.slug).length,1,'no duplicate: '+addition.slug);
for(const addition of ragAdditions) assert.equal(entries.filter(e=>e.slug===addition.slug).length,1,'no duplicate RAG entry: '+addition.slug);
const ragEvidence=JSON.parse(readFileSync(new URL('../database/evidence/rag-review-2026-11-02.json',import.meta.url),'utf8'));
const guides = catalog.guides;
const guidance = {reasons:Object.fromEntries(Object.entries(catalog.metrics).map(([slug,m])=>[slug,m.learningReason]))};
const inferenceCohort=catalog.metrics.ollama.communityInterest.cohort;
const inferenceCommunity={cohortLabel:catalog.metrics.ollama.communityInterest.cohortLabel,entries:Object.values(catalog.metrics).flatMap(m=>m.communityInterest?.cohort===inferenceCohort?[m.communityInterest]:[])};
const routes = ["/", "/atlas", ...Array.from({ length: 12 }, (_, i) => `/atlas/${String(i).padStart(2, "0")}`), ...discoverableEntries.map(entry => `/tools/${entry.slug}`), "/search", "/search?q=Flowise", "/search?q=AutoGen", "/search?q=zzzznotfound"];
for (const route of routes) {
  const response = await fetch(new URL(route, base));
  assert.equal(response.status, 200, route);
  const html = await response.text();
  assert.ok(html.includes('lang="he"') && html.includes('dir="rtl"'), `${route}: Hebrew RTL`);
  assert.ok(html.includes('id="main"'), `${route}: main landmark`);
  if (route === "/atlas") for (let i = 0; i < 12; i++) assert.ok(html.includes(`href="/atlas/${String(i).padStart(2, "0")}"`));
  if (route === "/atlas/09") assert.ok(html.includes('href="/tools/mcp"'));
  if (route.startsWith("/atlas/")) {
    assert.ok(html.includes('<table class="tools-table agent-table"'), `${route}: table is the default view`);
    assert.ok(html.includes('aria-label="תצוגת כלים"') && html.includes("כרטיסיות"), `${route}: view toggle`);
    assert.ok(html.includes("על הנתונים ומדד הפופולריות"), `${route}: metric definitions`);
    assert.ok(html.includes("יציאה ראשונית") && html.includes("Stars / GitHub"), `${route}: compact default columns`);
    const categoryId = route.split("/").pop();
    if(['09','10'].includes(categoryId)) {
      assert.ok(html.includes(integrationsGuides[categoryId].title));
      const names=[...html.matchAll(new RegExp('class="agent-name-label"><a[^>]*href="/tools/([^\"]+)"','g'))].map(m=>m[1]);
      assert.equal(names.length,categoryId==='09'?8:9);
      assert.equal(names[0],categoryId==='09'?'tool-integration-fundamentals':'ai-quality-security-fundamentals');
      if(categoryId==='10')assert.equal(entries.find(e=>e.slug==='langfuse').learningPriority,'must_learn');
    }
    if(['07','08'].includes(categoryId)) {
      assert.ok(html.includes(modelsGuides[categoryId].title));
      const names=[...html.matchAll(new RegExp('class="agent-name-label"><a[^>]*href="/tools/([^\"]+)"','g'))].map(m=>m[1]);
      assert.equal(names.length,categoryId==='07'?17:8);
      assert.equal(names[0],categoryId==='07'?'llm-fundamentals':'inference-fundamentals');
    }
    if(categoryId === "07") {
      assert.ok(html.includes('מיון לפי שימוש מפתחים (%)'));
      assert.equal((html.match(/class="agent-survey-usage"/g)??[]).length,17);
      assert.equal((html.match(/aria-label="אין נתון שימוש בסקר"/g)??[]).length,10);
      for(const percent of ['74.6','74.3','54.5','18.9','10.1','9.8','6.3']) assert.ok(html.replace(/<!--.*?-->/gs,'').includes(percent+'%'), 'survey percentage '+percent);
      assert.ok(html.includes('https://survey.stackoverflow.co/2026/technology/data/llm'));
      assert.ok(html.includes('2026') && html.includes('ODbL 1.0') && html.includes('11,895'));
    }else assert.ok(!html.includes('מיון לפי שימוש מפתחים (%)'), 'survey column belongs only to category 07');
    const categoryEntries = entries.filter(item => item.categoryIds.includes(categoryId)&&!item.lifecycle);
    const history = historicalEntries.filter(item=>item.categoryIds.includes(categoryId));
    if(history.length){assert.ok(html.includes('כלים היסטוריים ולא פעילים'));assert.ok(html.includes('<details class="historical-tools">'));for(const e of history)assert.ok(html.includes('href="/tools/'+e.slug+'"'));}
    if(categoryId==='06') {
      assert.equal(categoryEntries.length,6);
      assert.ok(html.includes(visualGuide.title));
      const rowNames=[...html.matchAll(new RegExp('class="agent-name-label"><a[^>]*href="/tools/([^"]+)"','g'))].map(m=>m[1]);
      assert.deepEqual(rowNames,['visual-ai-builders-fundamentals','dify','langflow','microsoft-copilot-studio','sim','botpress']);
      for(const a of visualAdditions) assert.ok(html.includes('href="/tools/'+a.slug+'"'));
      for(const a of visualHistory) assert.ok(html.includes('href="/tools/'+a.slug+'"'));
      assert.ok(!rowNames.includes('flowise')&&!rowNames.includes('openai-agent-builder'));
      assert.ok(html.includes('מיון לפי שם הכלי') && html.includes('שנת השקה') && html.includes('catalog-sort'));
    }
    if(categoryId==='05') {
      assert.equal(categoryEntries.length,8);
      for(const a of vectorAdditions)assert.ok(html.includes('href="/tools/'+a.slug+'"'));
      assert.ok(html.includes('Qdrant.Client') && html.includes('gRPC'));
    }
    if(categoryId==='02') {
      assert.equal(categoryEntries.length,11);
      assert.ok(html.includes('Legacy') && html.includes('microsoft-agent-framework'));
      for(const a of additions) assert.ok(html.includes('href="/tools/'+a.slug+'"'),a.slug);
    }
    if(categoryId==='04') {
      assert.equal(categoryEntries.length,11);
      assert.ok(html.includes('איך ללמוד מערכות RAG וידע?'));
      for(const a of ragAdditions) assert.ok(html.includes('href="/tools/'+a.slug+'"'),a.slug);
      for(const a of reviewAdditions) assert.ok(html.includes('href="/tools/'+a.slug+'"'),a.slug);
    }
    assert.ok(html.includes("חשיבות ללימוד") && html.includes("זו הערכה פדגוגית"), `${route}: learning guidance, not measured adoption`);
    assert.equal((html.match(/class="learning-importance"/g) ?? []).length, categoryEntries.length, `${route}: every row has guidance`);
    const plainText = html.replace(/<[^>]+>/g, "");
    for (const entry of categoryEntries) {
      assert.ok(guidance.reasons[entry.slug] && plainText.includes(guidance.reasons[entry.slug]), `${route}: specific learning rationale for ${entry.slug}`);
    }
    if (categoryId === "08") {
      assert.ok(html.includes(inferenceCommunity.cohortLabel), `${route}: separate inference cohort`);
      for (const item of inferenceCommunity.entries) {
        assert.ok(html.includes(item.stars.toLocaleString("en-US")), `${route}: collected repository stars`);
        assert.ok(html.includes(item.source), `${route}: GitHub evidence`);
      }
    }
    const guide = guides[categoryId];
    if (guide) {
      assert.ok(html.includes(guide.title), `${route}: learning guide`);
      for (const step of guide.steps) {
        assert.ok(entries.some(entry => entry.slug === step.slug), `${route}: valid guide destination`);
        assert.ok(html.includes(`href="/tools/${step.slug}"`), `${route}: guide link`);
      }
    }
    for (const entry of entries.filter(item => item.categoryIds.includes(categoryId))) assert.ok(html.includes(`href="/tools/${entry.slug}"`));
    assert.ok(!html.includes("התוכן בתחום הזה בהכנה"));
  }
  if (route.startsWith("/tools/")) {
    const entry = discoverableEntries.find(item => route === `/tools/${item.slug}`);
    const integrationRecord=[...integrationsAdditions,...integrationsCorrections].find(a=>a.slug===entry.slug);
    if(integrationRecord){
      const plain=html.replace(/<[^>]+>/g,'').replace(/<!--.*?-->/gs,'');
      assert.ok(plain.includes(integrationRecord.example),'integration/quality scenario: '+entry.slug);
      assert.ok(plain.includes(integrationRecord.languageSupportNote),'integration/quality SDK qualification: '+entry.slug);
      assert.ok(plain.includes(integrationRecord.alternativesNote),'learning alternatives: '+entry.slug);
      for(const [url] of integrationRecord.sources)assert.ok(html.includes(url.replaceAll('&','&amp;'))||html.includes(url),'integration/quality source: '+entry.slug);
    }
    const modelsRecord=[...modelsAdditions,...modelsCorrections].find(a=>a.slug===entry.slug);
    if(modelsRecord){
      const plain=html.replace(/<[^>]+>/g,'').replace(/<!--.*?-->/gs,'');
      assert.ok(plain.includes(modelsRecord.example),'approved scenario: '+entry.slug);
      assert.ok(plain.includes(modelsRecord.languageSupportNote),'language qualification: '+entry.slug);
      for(const [url] of modelsRecord.sources)assert.ok(html.includes(url.replaceAll('&','&amp;'))||html.includes(url),'official source: '+entry.slug);
    }
    const addition=additions.find(a=>a.slug===entry.slug);
    const ragAddition=ragAdditions.find(a=>a.slug===entry.slug);
    const reviewAddition=reviewAdditions.find(a=>a.slug===entry.slug);
    const correction=reviewCorrections.find(a=>a.slug===entry.slug);
    const visualAddition=visualAdditions.find(a=>a.slug===entry.slug);
    if(visualAddition || entry.slug==='dify') {
      const a=visualAddition??difyCorrection;
      const plain=html.replace(/<[^>]+>/g,'').replace(/<!--.*?-->/gs,'');
      assert.ok(plain.includes(a.example),'visual practical scenario: '+entry.slug);
      for(const [url] of a.sources)assert.ok(html.includes(url),'visual source: '+entry.slug);
      if(entry.kind!=='concept') for(const label of ['יתרונות','חסרונות','השוואה']) assert.ok(plain.includes(label),'visual comparison: '+entry.slug);
    }
    const vectorAddition=vectorAdditions.find(a=>a.slug===entry.slug);
    if(vectorAddition){
      assert.ok(html.includes(vectorAddition.docs));
      const plain=html.replace(/<[^>]+>/g,'').replace(/<!--.*?-->/gs,'');
      assert.ok(plain.includes(vectorAddition.example),'published choice scenario: '+entry.slug);
      for(const [url] of vectorAddition.extraSources??[])assert.ok(html.includes(url.replaceAll('&','&amp;')) || html.includes(url),'vector source: '+entry.slug);
    }
    if(entry.slug==='qdrant'){
      assert.ok(html.includes('Qdrant.Client') && html.includes('gRPC'));
      assert.ok(html.includes(qdrantCorrection.release.source));
      assert.ok(html.includes('35,390'));
    }
    if(reviewAddition){assert.ok(html.includes(reviewAddition.docs));assert.ok(html.includes(reviewAddition.release.source));assert.ok(html.includes('C#/.NET'));}
    if(correction){assert.ok(html.includes(correction.section[0]));if(correction.release)assert.ok(html.includes(correction.release.source));}
    if(entry.slug==='llamaindex')assert.ok(html.includes('TypeScript') && html.includes('Deprecated'));
    if(entry.slug==='ragflow')assert.ok(html.includes('Go') && html.includes('rc3'));
    if(entry.slug==='pathway')assert.ok(html.includes('BSL'));
    if(ragAddition) {
      assert.ok(html.includes(ragAddition.docs),'official RAG source: '+entry.slug);
      assert.ok(html.includes('C#/.NET'),'explicit .NET support: '+entry.slug);
      if(ragAddition.repo){const e=ragEvidence.find(e=>e.repo===ragAddition.repo);assert.ok(html.includes(e.stars.toLocaleString('en-US')) && html.includes(e.commitSource),'RAG snapshot: '+entry.slug);}
    }
    if(addition) {
      const evidence=frameworkEvidence.find(e=>e.repo===addition.repo);
      assert.ok(html.includes(evidence.stars.toLocaleString('en-US')),'verified stars: '+entry.slug);
      assert.ok(html.includes(evidence.commitSource),'verified activity source: '+entry.slug);
      assert.ok(html.includes(addition.release.source),'verified launch source: '+entry.slug);
      assert.ok(html.includes('C#/.NET') && html.includes('2026-11-02'),'languages and review: '+entry.slug);
      if(entry.lifecycle) assert.ok(html.includes('Legacy') && html.includes('href="/tools/microsoft-agent-framework"'));
    }
    assert.ok(html.includes("נוסף למאגר:") && new RegExp(`datetime="${entry.addedAt}"`, "i").test(html), `${route}: catalog addition date`);
    assert.ok(html.includes('id="practice"') && html.includes('id="sources"'));
    for (const source of entry.sources) assert.ok(html.includes(`href="${source.url}"`), `${route}: source link`);
    for (const slug of entry.relatedSlugs ?? []) assert.ok(html.includes(`href="/tools/${slug}"`), `${route}: related link`);
  }
  if(route.startsWith('/search')) {
    assert.ok(html.includes('role="search"'));
    if(route.includes('Flowise'))assert.ok(html.includes('href="/tools/flowise"')&&html.includes('Discontinued'));
    if(route.includes('AutoGen'))assert.ok(html.includes('href="/tools/microsoft-autogen"')&&html.includes('Legacy'));
    if(route.includes('zzzznotfound'))assert.ok(html.includes('לא נמצאו תוצאות'));
  }
  if (route === "/tools/mcp") assert.ok(html.includes('href="https://modelcontextprotocol.io/'));
  console.log(`PASS ${route}`);
}
for (const route of ["/atlas/99", "/tools/missing", "/missing-page"]) {
  assert.equal((await fetch(new URL(route, base))).status, 404, route);
  console.log(`PASS ${route}: 404`);
}
