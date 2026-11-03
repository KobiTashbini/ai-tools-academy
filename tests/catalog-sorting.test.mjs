import test from 'node:test';
import assert from 'node:assert/strict';
import {sortAgentEntries} from '../src/data/agent-catalog.mjs';
const entries=[{slug:'a',name:'Alpha',kind:'framework',learningPriority:'should_know'},{slug:'z',name:'Zulu',kind:'framework',learningPriority:'should_know'},{slug:'core',name:'Core',kind:'concept',learningPriority:'must_learn'},{slug:'must',name:'Must',kind:'sdk',learningPriority:'must_learn'}];
test('learning order puts foundations first, then importance and guide order without changing manual name sort',()=>{
 assert.deepEqual(sortAgentEntries(entries,{}, {},'learningPriority','desc',['z','a']).map(e=>e.slug),['core','must','z','a']);
 assert.deepEqual(sortAgentEntries(entries,{}, {},'name','asc',['z','a']).map(e=>e.slug),['a','core','must','z']);
});
test('numeric sorting retains zero and puts unknown values last in both directions',()=>{
 const facts={a:{github:{stars:0},release:{value:'2020'}},z:{github:{stars:200},release:{value:'2023-02-01'}},core:{github:{}},must:{github:{stars:10},release:{value:'2023'}}};
 const metrics={a:{communityInterest:{score:0}},z:{communityInterest:{score:80}},core:{},must:{communityInterest:{score:10}}};
 for(const key of ['stars','popularity','releaseYear']) for(const direction of ['asc','desc']) {
  const sorted=sortAgentEntries(entries,facts,metrics,key,direction);
  assert.equal(sorted.at(-1).slug,'core');
  assert.equal(sorted[0].slug,direction==='asc'?'a':key==='releaseYear'?'must':'z');
 }
});
