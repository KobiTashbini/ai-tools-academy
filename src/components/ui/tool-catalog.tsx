"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import type { KnowledgeEntry } from "@/domain/knowledge";
import type { ToolFacts, SortKey, SortDirection } from "@/domain/tool-facts";
import { formatDate, sortTools } from "@/data/tool-facts.mjs";
import { KnowledgeText } from "./knowledge-text";

const types: Record<KnowledgeEntry["kind"], string> = {
  protocol: "Protocol", model: "Model", sdk: "SDK", framework: "Framework", platform: "Platform",
  concept: "Concept", product: "Product", database: "Vector Database", runtime: "Inference Runtime", orchestration_engine: "Orchestration Engine",
};
const numbers = new Intl.NumberFormat("en-US");

export function ToolCatalog({ entries, facts }: { entries: readonly KnowledgeEntry[]; facts: Readonly<Record<string, ToolFacts>> }) {
  const [view, setView] = useState<"table" | "cards">("table");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [direction, setDirection] = useState<SortDirection>("asc");
  const sorted = sortTools(entries, facts, sortKey, direction);
  const has = (key: SortKey) => key === "name" || entries.some(entry => key === "release" ? facts[entry.slug].release : key === "stars" ? facts[entry.slug].github.stars !== undefined : facts[entry.slug].popularity.score !== null);
  function changeSort(key: SortKey) {
    if (key === sortKey) setDirection(direction === "asc" ? "desc" : "asc");
    else { setSortKey(key); setDirection(key === "stars" || key === "popularity" ? "desc" : "asc"); }
  }
  function sortable(label: string, key: SortKey) {
    return <th scope="col" aria-sort={key === sortKey ? direction === "asc" ? "ascending" : "descending" : "none"} className={key === "name" ? "tool-name" : undefined}><button type="button" onClick={() => changeSort(key)} disabled={!has(key)} aria-label={`מיון לפי ${label}`} title={has(key) ? "לחיצה מחליפה את כיוון המיון; מידע חסר בסוף" : "אין נתונים זמינים למיון בקטגוריה זו"}>{label} {key === sortKey ? direction === "asc" ? "↑" : "↓" : "↕"}</button></th>;
  }
  function toggle(slug: string) { setExpanded(expanded === slug ? null : slug); }
  const firstFacts = facts[entries[0]?.slug];
  return <div className="tool-catalog">
    <div className="catalog-toolbar"><p aria-live="polite">{entries.length} פריטי ידע · {view === "table" ? "תצוגת טבלה" : "תצוגת כרטיסיות"}</p><div role="group" aria-label="תצוגת כלים"><button type="button" aria-pressed={view === "table"} onClick={() => setView("table")}>טבלה</button><button type="button" aria-pressed={view === "cards"} onClick={() => setView("cards")}>כרטיסיות</button></div></div>
    {view === "table" ? <>
      <p id="table-help" className="table-help">לחצו על שורה או על כפתור „פרטים” להרחבה מתחתיה. שם הכלי פותח את העמוד המלא. בנייד ניתן לגלול את הטבלה לצדדים; שמות הכלים נשארים גלויים.</p>
      <div className="table-scroll" tabIndex={0} role="region" aria-label="טבלת כלים — גלילה אופקית" aria-describedby="table-help">
        <table className="tools-table"><caption className="sr-only">כלים בקטגוריה, תפקיד, שפות ומדדי מאגר מתוארכים</caption>
          <thead><tr>{sortable("שם הכלי", "name")}<th scope="col" className="tool-description">מה הכלי עושה?</th><th scope="col">סוג</th><th scope="col" className="tool-languages">שפות נתמכות</th>{sortable("תאריך השקה", "release")}<th scope="col"><bdi>GitHub</bdi></th>{sortable("Stars", "stars")}<th scope="col">עדכון אחרון</th>{sortable("פופולריות", "popularity")}</tr></thead>
          <tbody>{sorted.map(entry => {
            const fact = facts[entry.slug], repo = fact.github, open = expanded === entry.slug;
            return <Fragment key={entry.slug}>
              <tr className={`tool-row${open ? " is-expanded" : ""}`} onClick={event => { if (!(event.target as HTMLElement).closest("a,button")) toggle(entry.slug); }}>
                <th scope="row" className="tool-name"><Link href={`/tools/${entry.slug}`} className="text-link"><bdi>{entry.name}</bdi></Link><button type="button" className="expand-button" aria-expanded={open} aria-controls={`details-${entry.slug}`} onClick={() => toggle(entry.slug)} aria-label={`${open ? "סגירת" : "הרחבת"} פרטים על ${entry.name}`}>{open ? "סגירה −" : "פרטים +"}</button></th>
                <td className="tool-description"><KnowledgeText text={fact.description} /></td>
                <td><bdi>{types[entry.kind]}</bdi></td>
                <td className="tool-languages"><KnowledgeText text={fact.languages} /></td>
                <td>{fact.release ? <a href={fact.release.source} className="text-link" title={fact.release.note}><time dateTime={fact.release.value}><bdi>{formatDate(fact.release.value)}</bdi></time></a> : "לא אומת"}</td>
                <td>{repo.status === "verified" ? <a className="text-link" href={repo.url} title={repo.scope} aria-label={`מאגר רשמי של ${entry.name}`}><bdi>GitHub ↗</bdi></a> : repo.status === "not_applicable" ? "לא רלוונטי" : "לא אומת"}</td>
                <td>{repo.status === "verified" && repo.stars !== undefined ? <a className="text-link" href={repo.starsSource} title={`נאסף ${formatDate(repo.collectedAt)}. ${repo.scope}`}><bdi>{numbers.format(repo.stars)}</bdi></a> : repo.status === "not_applicable" ? "לא רלוונטי" : "לא אומת"}</td>
                <td>{repo.lastActivity ? <a className="text-link" href={repo.lastActivity.source} title={`תאריך committer של Commit בראש ${repo.lastActivity.branch}; לא תאריך Push או גרסה`}><time dateTime={repo.lastActivity.date}><bdi>{formatDate(repo.lastActivity.date)}</bdi></time></a> : repo.status === "not_applicable" ? "לא רלוונטי" : "לא אומת"}</td>
                <td><span title={`${fact.popularity.algorithm}: ${fact.popularity.reason}`}>לא זמין</span></td>
              </tr>
              <tr id={`details-${entry.slug}`} hidden={!open} className="expanded-row"><td colSpan={9}><div className="tool-details"><h2><bdi>{entry.name}</bdi> — מידע נוסף</h2><p><KnowledgeText text={entry.summary} /></p><div className="detail-columns"><section><h3>שימושים ודוגמה</h3><p><KnowledgeText text={entry.example} /></p></section><section><h3>בחירה, יתרונות ומגבלות</h3>{entry.sections.filter(section => /מתי|בחיר|פותר|נכון/.test(section.title)).slice(0,2).map(section => <p key={section.title}><KnowledgeText text={section.text} /></p>)}<p><KnowledgeText text={entry.alternativesNote} /></p></section></div><h3>שפות ואינטגרציה</h3><p><KnowledgeText text={entry.languageSupportNote} /></p><h3>מקורות וגבולות המדידה</h3><p>{repo.scope}</p>{repo.collectedAt && <p>נתוני המאגר נאספו ב־<bdi>{formatDate(repo.collectedAt)}</bdi>; צילום מצב, ללא עדכון חי. תאריך פעילות: תאריך ה־Commit בראש הענף <bdi>{repo.lastActivity?.branch}</bdi>.</p>}{fact.release && <p>{fact.release.note} <a className="text-link" href={fact.release.source}>מקור תאריך ההשקה</a></p>}<ul>{entry.sources.map(source => <li key={source.url}><a className="text-link" href={source.url}><KnowledgeText text={source.title} /></a></li>)}</ul><Link className="button primary" href={`/tools/${entry.slug}`}>לעמוד הלימוד המלא — <bdi>{entry.name}</bdi></Link></div></td></tr>
            </Fragment>;
          })}</tbody>
        </table>
      </div>
    </> : <div className="cards">{sorted.map(entry => <Link href={`/tools/${entry.slug}`} className="card category-card" key={entry.slug}><span className="badge"><bdi>{types[entry.kind]}</bdi></span><h2><bdi>{entry.name}</bdi></h2><p><KnowledgeText text={facts[entry.slug].description} /></p><span className="card-meta">לעמוד הלימוד המלא ←</span></Link>)}</div>}
    <p className="snapshot-label">נתוני המאגר הם צילום מצב מ־<bdi>{formatDate(firstFacts?.popularity.collectedAt)}</bdi>, ללא עדכון חי. עדכון אחרון: Commit בראש הענף הראשי, לא Push או גרסה.</p>
    <details className="metrics-note"><summary>על הנתונים ומדד הפופולריות</summary><p>Stars הם מספר הכוכבים במאגר המסוים שבקישור, ולא מדד לאיכות או ציון פופולריות כולל. הנתונים נאספו ב־<bdi>{formatDate(firstFacts?.popularity.collectedAt)}</bdi> ונשמרו מקומית; אין עדכון בזמן אמת. תאריך „עדכון אחרון” הוא תאריך ה־committer של ה־Commit בראש הענף הראשי בזמן האיסוף, לפי UTC — לא Push ולא גרסה רשמית.</p><p>תאריך השקה מוצג רק עם מקור להשקה ציבורית ראשונה, לרבות Preview שמסומן במפורש. תאריך יצירת המאגר אינו משמש כתחליף.</p><p><bdi>{firstFacts?.popularity.algorithm}</bdi> נבחר כמועמד: חסרה היסטוריית גידול Stars ו־Forks בתקופה אחידה ולכן לא מוצג ציון. לא שולבו Criticality, תחזוקה או איכות. <a className="text-link" href={firstFacts?.popularity.source}>מתודולוגיית OSS Compass</a></p></details>
  </div>;
}
