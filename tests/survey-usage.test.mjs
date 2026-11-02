import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sortAgentEntries} from '../src/data/agent-catalog.mjs';

test('survey use sorts numerically both ways with missing last, retaining a real zero',()=>{
  const entries=[['unknown',null],['small',9.8],['zero',0],['large',74.6],['middle',18.9]].map(([slug])=>({slug,name:slug}));
  const metrics={unknown:{},small:{surveyUsage:{percent:9.8}},zero:{surveyUsage:{percent:0}},large:{surveyUsage:{percent:74.6}},middle:{surveyUsage:{percent:18.9}}};
  assert.deepEqual(sortAgentEntries(entries,{},metrics,'surveyUsage','asc').map(e=>e.slug),['zero','small','middle','large','unknown']);
  assert.deepEqual(sortAgentEntries(entries,{},metrics,'surveyUsage','desc').map(e=>e.slug),['large','middle','small','zero','unknown']);
  assert.equal(entries[0].slug,'unknown');
});
