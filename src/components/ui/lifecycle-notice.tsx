import Link from 'next/link';
import type {KnowledgeEntry} from '@/domain/knowledge';
import {KnowledgeText} from './knowledge-text';
import {formatDate} from '@/data/tool-facts.mjs';
export const lifecycleLabels={legacy:'Legacy — דור קודם / הוצא משימוש',maintenance:'Maintenance — תחזוקה בלבד',discontinued:'Discontinued — הופסק'};
export function LifecycleNotice({entry,alternatives=[]}:{entry:KnowledgeEntry;alternatives?:readonly KnowledgeEntry[]}) {
 const l=entry.lifecycle;if(!l)return null;
 return <aside className="notice lifecycle-notice">
   <strong><bdi>{lifecycleLabels[l.status]}</bdi></strong>
   <p>{l.status==='maintenance'?'עדיין בתחזוקה מוגבלת; אין פירוש הדבר שהכלי הופסק.':l.status==='legacy'?'רשומת דור קודם או מוצר שהוצא משימוש; אין בכך לבדו טענה שהשירות כבר נסגר.':'סיום הפעילות מתועד במקור המקושר.'} אינה נכללת ברשימת ההמלצות הפעילה.</p>
   <p><KnowledgeText text={l.note}/></p>
   {l.effectiveAt?<p>{l.dateLabel}: <time dateTime={l.effectiveAt}><bdi>{formatDate(l.effectiveAt)}</bdi></time></p>:<p>מועד השינוי לא אומת.</p>}
   {l.scheduledEndAt&&<p>סגירה מתוכננת: <time dateTime={l.scheduledEndAt}><bdi>{formatDate(l.scheduledEndAt)}</bdi></time> — מועד עתידי אינו אישור שהסגירה כבר בוצעה.</p>}
   {l.sourceUrl&&<p><a href={l.sourceUrl} className="text-link">מקור מאומת למצב</a>{l.checkedAt&&<> · נבדק ב־<time dateTime={l.checkedAt}><bdi>{formatDate(l.checkedAt)}</bdi></time></>}</p>}
   <div><strong>חלופות פעילות</strong>{alternatives.length?<ul>{alternatives.map(a=><li key={a.slug}><Link href={'/tools/'+a.slug} className="text-link"><bdi>{a.name}</bdi></Link>{a.slug===l.successorSlug?' — מחליפה מתועדת':' — חלופה לבחינה'}</li>)}</ul>:<p>טרם קושרה חלופה פעילה מאומתת.</p>}</div>
 </aside>;
}
