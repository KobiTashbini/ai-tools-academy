import { validateContent } from './validate-content.mjs';
export async function readDatabaseCatalog(client) {
 await client.query('begin isolation level repeatable read read only');
 try {
 const read=async sql=>JSON.parse(JSON.stringify((await client.query(sql)).rows));
 const categories=await read('select * from academy.categories order by id');
 const all=(await read('select document from academy.entry_documents order by slug')).map(r=>r.document);
 validateContent(categories,all);
 const facts={},metrics={},guides={};
 const method=(await read("select * from academy.metric_methods where id='oss_compass_v3'"))[0];
 const rows=await read(`select c.*,f.repository_status,f.repository_note,f.reviewed_at::text,
 (select jsonb_agg(label order by position) from academy.entry_language_labels where entry_id=c.id) labels,
 (select row_to_json(x) from academy.entry_releases x where entry_id=c.id) release,
 (select row_to_json(x) from (select r.url,r.scope_note,s.* from academy.repositories r join academy.repository_snapshots s on s.repository_url=r.url where r.entry_id=c.id order by s.collected_at desc limit 1) x) repository
 from academy.catalog c join academy.catalog_facts f on f.entry_id=c.id`);
 for(const r of rows){
 if(!r.labels?.length||!r.learning_reason?.trim()||!method) throw Error('Incomplete catalog');
 const s=r.repository,t=r.release;
 facts[r.slug]={description:r.catalog_description,languages:r.language_support_summary,languageSources:all.find(e=>e.id===r.id).sources.map(s=>s.url),
 github:s?{status:'verified',scope:s.scope_note,url:s.url,stars:Number(s.stars),starsSource:s.source_url,collectedAt:s.collected_at,...(s.last_activity_at?{lastActivity:{date:s.last_activity_at,source:s.activity_source_url,branch:s.branch,method:s.activity_method}}:{})}:{status:r.repository_status??'unverified',scope:r.repository_note??''},
 popularity:{algorithm:method.name,source:method.source_url,score:null,reason:method.note,collectedAt:r.reviewed_at},
 ...(t?{release:{value:t.precision==='year'?String(t.release_year):t.release_date,precision:t.precision,source:t.source_url,note:t.note}}:{})};
 metrics[r.slug]={slug:r.slug,description:r.catalog_description,languages:r.labels,learningReason:r.learning_reason,collectedAt:r.reviewed_at};
 }
 const interests=await read(`select i.*,e.slug,c.label,m.name,s.stars,s.forks,s.source_url,r.url,
 max(s.stars) over(partition by i.cohort_id,i.collected_at) max_stars,max(s.forks) over(partition by i.cohort_id,i.collected_at) max_forks
 from academy.community_interest i join academy.entries e on e.id=i.entry_id join academy.metric_cohorts c on c.id=i.cohort_id join academy.metric_methods m on m.id=c.method_id
 join academy.repositories r on r.entry_id=i.entry_id join academy.repository_snapshots s on s.repository_url=r.url and s.collected_at=i.collected_at order by i.collected_at asc`);
 for(const r of interests) metrics[r.slug].communityInterest={score:Number(r.score),stars:Number(r.stars),forks:Number(r.forks),maxStars:Number(r.max_stars),maxForks:Number(r.max_forks),method:r.name,source:r.source_url,repository:r.url,collectedAt:r.collected_at,cohort:r.cohort_id,...(r.label?{cohortLabel:r.label}:{})};
 for(const p of await read('select p.*,e.slug from academy.package_metrics p join academy.entries e on e.id=p.entry_id order by collected_at asc')){
 if(p.request_status!=='200'||p.value===null) continue;
 if(p.method_id==='source_rank') metrics[p.slug].sourceRank={score:Number(p.value),source:p.source_url,package:p.package_name,repository:p.package_repository_url,platform:p.ecosystem,updatedAt:p.measured_at};
 if(p.method_id==='npms_popularity') metrics[p.slug].popularity={score:Number(p.value),source:p.source_url,package:p.package_name,repository:p.package_repository_url.replace(/^git\+/,'').replace(/\.git$/,''),analyzedAt:p.measured_at,identitySource:p.identity_source_url,methodSource:'https://github.com/npms-io/npms-analyzer/blob/master/lib/scoring/score.js',historical:true};
 }
 for(const g of await read('select * from academy.category_guides')) guides[g.category_id]={title:g.title,intro:g.introduction,note:g.note,steps:[]};
 for(const s of await read('select s.*,e.slug,e.publication_status from academy.category_guide_steps s join academy.entries e on e.id=s.entry_id order by position')) if(s.publication_status==='published') guides[s.category_id].steps.push({text:s.instruction,slug:s.slug,label:s.link_label});
 await client.query('commit');
 return {categories,entries:all.filter(e=>e.publicationStatus==='published'),facts,metrics,guides};
 }catch(error){await client.query('rollback');throw error;}
}
