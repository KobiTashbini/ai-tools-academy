import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { assembleEntries } from "../src/data/assemble-entries.mjs";
import { assembleToolFacts } from "../src/data/tool-facts.mjs";
import { buildAgentMetrics, sortAgentEntries } from "../src/data/agent-catalog.mjs";
const read = file => JSON.parse(readFileSync(new URL(`../content/${file}`,import.meta.url),"utf8"));
const entries = assembleEntries(read("entries.json"),read("lessons.json")).filter(entry=>entry.categoryIds.includes("02"));
const presentation = read("category-02-presentation.json"), snapshot = read("category-02-metric-snapshot.json"), community = read("category-02-community-interest.json");
const metrics = buildAgentMetrics(entries,presentation,snapshot,community);
const allEntries = assembleEntries(read("entries.json"),read("lessons.json"));
const facts = assembleToolFacts(read("tool-facts.json"),read("github-snapshot.json"),allEntries);
test("only the seven existing category 02 entries receive the compact pilot",()=>{
  assert.equal(Object.keys(metrics).length,7);
  assert.ok(metrics["microsoft-agent-framework"].languages.includes("C#/.NET"));
  assert.ok(metrics.temporal.languages.includes("C#/.NET"));
  assert.equal(metrics.codex,undefined);
});
test("local interest has real input provenance and stays within its documented scale",()=>{
  for(const metric of Object.values(metrics)) {
    assert.ok(metric.communityInterest.score>=0 && metric.communityInterest.score<=100);
    assert.ok(metric.communityInterest.source.startsWith("https://api.github.com/repos/"));
    assert.equal(metric.communityInterest.cohort,"category-02-seven-official-repositories");
  }
  assert.equal(metrics.langchain.communityInterest.score,100);
});
test("equal relative inputs produce the same interest score independent of absolute scale",()=>{
  const scaled=structuredClone(community);
  for(const item of scaled.entries){item.stars*=2;item.forks*=2;}
  const next=buildAgentMetrics(entries,presentation,snapshot,scaled);
  for(const slug of Object.keys(metrics))assert.equal(next[slug].communityInterest.score,metrics[slug].communityInterest.score);
});
test("negative counts and mismatched source identity are rejected",()=>{
  const bad=structuredClone(community);bad.entries[0].stars=-1;
  assert.throws(()=>buildAgentMetrics(entries,presentation,snapshot,bad),/inputs/);
  bad.entries[0].stars=10;bad.entries[0].source="https://api.github.com/repos/unrelated/repository";
  assert.throws(()=>buildAgentMetrics(entries,presentation,snapshot,bad),/inputs/);
});
test("npms archive and SourceRank never replace the local interest score",()=>{
  assert.equal(metrics.temporal.popularity.score,0.10084060588298586);
  assert.equal(metrics.temporal.popularity.analyzedAt,"2022-12-17T15:44:03.377Z");
  assert.equal(metrics.temporal.popularity.historical,true);
  assert.equal(metrics.langchain.sourceRank.score,27);
  assert.notEqual(metrics.langchain.communityInterest.score,metrics.langchain.sourceRank.score);
});
test("sort preserves all tools and puts missing optional ranks last in both directions",()=>{
  for(const direction of ["asc","desc"]){
    const sorted=sortAgentEntries(entries,facts,metrics,"sourceRank",direction);
    assert.equal(sorted.length,7);
    assert.equal(metrics[sorted.at(-1).slug].sourceRank,undefined);
  }
  assert.equal(sortAgentEntries(entries,facts,metrics,"popularity","desc")[0].slug,"langchain");
});
