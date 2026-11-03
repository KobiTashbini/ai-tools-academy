import Link from 'next/link';
import {listDiscoverableEntries} from '@/data/knowledge';
import {searchCatalogEntries} from '@/data/catalog-lifecycle.mjs';
import {lifecycleLabels} from '@/components/ui/lifecycle-notice';
import {KnowledgeText} from '@/components/ui/knowledge-text';
export const metadata={title:'חיפוש בקטלוג'};
export const dynamic='force-dynamic';
export const runtime='nodejs';
export default async function SearchPage({searchParams}:{searchParams:Promise<{q?:string|string[]}>}) {
 const params=await searchParams;const query=(typeof params.q==='string'?params.q:'').slice(0,200).trim();
 const results=query?searchCatalogEntries(await listDiscoverableEntries(),query):[];
 return <section className="catalog"><h1>חיפוש בקטלוג</h1><p>חיפוש לפי שם ותיאור, כולל כלים היסטוריים עם סטטוס מפורש. הופעה בחיפוש אינה המלצת שימוש.</p>
 <form action="/search" method="get" role="search" className="catalog-search"><label htmlFor="catalog-query">שם כלי או נושא</label><input id="catalog-query" name="q" defaultValue={query} type="search" maxLength={200} placeholder="למשל Flowise או Langflow"/><button className="button primary" type="submit">חיפוש</button></form>
 {query?<><p role="status">{results.length?`נמצאו ${results.length} תוצאות`:'לא נמצאו תוצאות. נסו שם אחר או מילה קצרה יותר.'}</p><div className="cards">{results.map(e=><article className="card" key={e.slug}><span className="badge">{e.lifecycle?<bdi>{lifecycleLabels[e.lifecycle.status]}</bdi>:'ברשימת הלמידה הפעילה'}</span><h2><Link href={'/tools/'+e.slug} className="text-link"><bdi>{e.name}</bdi></Link></h2><p><KnowledgeText text={e.summary}/></p>{e.lifecycle&&<p><KnowledgeText text={e.lifecycle.note}/></p>}</article>)}</div></>:<p>הקלידו שם כלי או נושא כדי לחפש בכל הקטגוריות.</p>}
 </section>;
}
