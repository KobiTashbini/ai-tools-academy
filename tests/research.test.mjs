import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateProposals} from '../src/data/validate-proposals.mjs';
import {validateContent} from '../src/data/validate-content.mjs';
import {assembleEntries} from '../src/data/assemble-entries.mjs';
const read=file=>JSON.parse(readFileSync(new URL(`../${file}`,import.meta.url),'utf8'));
const categories=read('content/categories.json');
const entries=assembleEntries(read('content/entries.json'),read('content/lessons.json'));
const proposal={id:'test-proposal',kind:'learning_priority',slug:'ollama',title:'הצעת בדיקה',categoryIds:['08'],status:'pending_review',discoveredAt:'2026-10-31',checkedAt:'2026-10-31',currentValue:'should_know',proposedValue:'must_learn',rationale:'נימוק לדוגמה בלבד',tradeoffs:'הצעה סינתטית בבדיקה בלבד',confidence:'medium',sources:[{kind:'official',title:'מקור בדיקה',url:'https://example.com/evidence',checkedAt:'2026-10-31',supports:'ראיה סינתטית'}],approval:null};
test('pending research cannot carry approval and applied changes require a decision reference',()=>{
 const queue={schemaVersion:1,proposals:[structuredClone(proposal)]};
 assert.doesNotThrow(()=>validateProposals(queue,entries,categories));
 queue.proposals[0].approval={decidedAt:'2026-10-31',reference:'test',decision:'approved'};
 assert.throws(()=>validateProposals(queue,entries,categories),/pending/);
 queue.proposals[0].status='applied';queue.proposals[0].approval.reference='';
 assert.throws(()=>validateProposals(queue,entries,categories),/decision evidence/);
});
test('research rejects duplicate catalog tools, missing official evidence and executable links',()=>{
 for(const mutate of [p=>{p.kind='new_tool'},p=>{p.sources[0].kind='vendor_claim'},p=>{p.sources[0].url='javascript:alert(1)'}]){
  const p=structuredClone(proposal);mutate(p);
  assert.throws(()=>validateProposals({schemaVersion:1,proposals:[p]},entries,categories),/Invalid research/);
 }
});
test('new catalog additions require discovery, approval and ordered addition dates',()=>{
 const changed=structuredClone(entries);changed[0].addedAtBasis='approved_proposal';
 assert.throws(()=>validateContent(categories,changed),/approval evidence/);
 changed[0].discoveredAt='2026-10-30';changed[0].approvedAt='2026-10-31';changed[0].approvalReference='explicit-user-decision-test';
 assert.doesNotThrow(()=>validateContent(categories,changed));
 changed[0].addedAt='2026-10-29';
 assert.throws(()=>validateContent(categories,changed),/approval evidence/);
});
