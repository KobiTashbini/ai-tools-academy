import Link from 'next/link';
import type {KnowledgeEntry} from '@/domain/knowledge';
import {activeAlternatives} from '@/data/catalog-lifecycle.mjs';
import {LifecycleNotice} from './lifecycle-notice';
export function HistoricalTools({entries,allEntries}:{entries:readonly KnowledgeEntry[];allEntries:readonly KnowledgeEntry[]}) {
 if(!entries.length)return null;
 return <details className="historical-tools"><summary>כלים היסטוריים ולא פעילים ({entries.length})</summary>
  <p>Legacy מציין דור קודם או הוצאה משימוש; Maintenance מציין תחזוקה מוגבלת; Discontinued מציין הפסקה שאומתה במקור. רשומות אלה נשארות זמינות לחיפוש וללימוד היסטורי.</p>
  {entries.map(entry=><article key={entry.slug}><h2><Link href={'/tools/'+entry.slug} className="text-link"><bdi>{entry.name}</bdi></Link></h2><LifecycleNotice entry={entry} alternatives={activeAlternatives(entry,allEntries)}/></article>)}
 </details>;
}
