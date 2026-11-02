import {writeFileSync} from 'node:fs';
const repos=['deepset-ai/haystack','infiniflow/ragflow','docling-project/docling','Unstructured-IO/unstructured','microsoft/graphrag','HKUDS/LightRAG'];
const output=[];
for(const repo of repos){const base='https://api.github.com/repos/'+repo;
 const r=await fetch(base,{headers:{'User-Agent':'AI-TOOLS-Academy'}});if(!r.ok)throw Error('GitHub '+r.status);const m=await r.json();
 const c=await fetch(base+'/commits/'+encodeURIComponent(m.default_branch),{headers:{'User-Agent':'AI-TOOLS-Academy'}});if(!c.ok)throw Error('Commit '+c.status);const h=await c.json();
 output.push({repo,url:m.html_url,stars:m.stargazers_count,forks:m.forks_count,branch:m.default_branch,commitDate:h.commit.committer.date,commitSha:h.sha,commitSource:base+'/commits/'+h.sha,starsSource:base,collectedAt:new Date().toISOString()});}
writeFileSync('database/evidence/rag-systems-2026-11-02.json',JSON.stringify(output,null,2)+'\n');console.log(JSON.stringify(output,null,2));
