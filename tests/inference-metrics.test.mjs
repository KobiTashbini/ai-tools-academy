import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildInferenceInterest} from '../src/data/inference-metrics.mjs';
import {sortAgentEntries} from '../src/data/agent-catalog.mjs';
const read=name=>JSON.parse(readFileSync(new URL(`../content/${name}`,import.meta.url),'utf8'));
const community=read('inference-community-interest.json'), snapshots=read('github-snapshot.json');
test('inference scores use their own complete cohort and cannot leak onto model or platform entries',()=>{
  const result=buildInferenceInterest(community,snapshots);
  assert.deepEqual(Object.keys(result).sort(),['llama-cpp','ollama','vllm']);
  assert.ok(Object.values(result).every(item=>item.score>=0 && item.score<=100 && item.cohort==='category-08-three-inference-runtimes'));
  assert.equal(result['lm-studio'],undefined);
  assert.equal(result['openai-gpt'],undefined);
  const missing=structuredClone(community);missing.entries.pop();
  assert.throws(()=>buildInferenceInterest(missing,snapshots),/evidence/);
});
test('stale, mismatched and negative inference evidence is rejected',()=>{
  for(const mutate of [c=>{c.entries[0].stars++},c=>{c.entries[0].forks=-1},c=>{c.entries[0].repository='https://github.com/example/other'},c=>{c.collectedAt='2026-01-01T00:00:00Z'}]){
    const changed=structuredClone(community);mutate(changed);
    assert.throws(()=>buildInferenceInterest(changed,snapshots),/evidence/);
  }
});
test('popular inference runtimes sort numerically while an unmeasured product remains last',()=>{
  const interests=buildInferenceInterest(community,snapshots);
  const entries=['lm-studio','vllm','ollama','llama-cpp'].map(slug=>({slug,name:slug}));
  const metrics=Object.fromEntries(entries.map(e=>[e.slug,{communityInterest:interests[e.slug]}]));
  for(const direction of ['asc','desc']){
    const sorted=sortAgentEntries(entries,{},metrics,'popularity',direction);
    assert.equal(sorted.at(-1).slug,'lm-studio');
    const values=sorted.slice(0,-1).map(e=>interests[e.slug].score);
    assert.deepEqual(values,[...values].sort((a,b)=>direction==='asc'?a-b:b-a));
  }
});
