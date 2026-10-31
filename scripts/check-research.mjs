import {readFileSync} from 'node:fs';
import {assembleEntries} from '../src/data/assemble-entries.mjs';
import {validateProposals} from '../src/data/validate-proposals.mjs';
const read=file=>JSON.parse(readFileSync(new URL(`../${file}`,import.meta.url),'utf8'));
const entries=assembleEntries(read('content/entries.json'),read('content/lessons.json'));
const queue=read('research/proposals.json');
validateProposals(queue,entries,read('content/categories.json'));
console.log(`Research queue valid: ${queue.proposals.length} proposals; ${entries.length} catalog entries.`);
