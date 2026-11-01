import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEntry, listCategories, listPublishedEntries } from "@/data/knowledge";
import { kindLabels, priorityLabels } from "@/domain/knowledge";
import { KnowledgeText } from "@/components/ui/knowledge-text";

type Props = { params: Promise<{ slug: string }> };
// Regenerate from the database at most every 5 minutes; entries added later render on first request.
export const revalidate = 300;
export async function generateStaticParams() { return (await listPublishedEntries()).map(entry => ({ slug: entry.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = await getEntry((await params).slug);
  return { title: entry?.name ?? "פריט לא נמצא", description: entry?.summary };
}
export default async function ToolPage({ params }: Props) {
  const entry = await getEntry((await params).slug);
  if (!entry) notFound();
  const [categories, published] = await Promise.all([listCategories(), listPublishedEntries()]);
  const getCategory = (id: string) => categories.find(item => item.id === id);
  const category = getCategory(entry.categoryIds[0]);
  const related = (entry.relatedSlugs ?? []).map(slug => published.find(item => item.slug === slug)).filter(item => item !== undefined);
  return <article className="catalog detail">
    <nav className="breadcrumbs" aria-label="מיקום באתר"><Link href="/">בית</Link><span aria-hidden="true">/</span><Link href="/atlas">אטלס הידע</Link>{category && <><span aria-hidden="true">/</span><Link href={`/atlas/${category.id}`}><bdi>{category.name}</bdi></Link></>}<span aria-hidden="true">/</span><span aria-current="page"><bdi>{entry.name}</bdi></span></nav>
    <p className="eyebrow">{kindLabels[entry.kind]}</p><h1><bdi>{entry.name}</bdi></h1><p className="intro"><KnowledgeText text={entry.summary} /></p>
    <div className="entry-tags">{entry.learningPriority && <span className="badge">{priorityLabels[entry.learningPriority]}</span>}{entry.categoryIds.map(id => { const item = getCategory(id); return item && <Link className="badge" key={id} href={`/atlas/${id}`}><bdi>{item.name}</bdi></Link>; })}</div>
    <p className="card-meta">נוסף למאגר: <time dateTime={entry.addedAt}><bdi>{entry.addedAt}</bdi></time>{entry.addedAtBasis === "historical_backfill" && " · תאריך היסטורי שתועד בדיעבד; אינו תאריך השקת הכלי"}</p>
    {entry.prerequisites && <section className="knowledge-section"><h2>לפני שמתחילים</h2><p><KnowledgeText text={entry.prerequisites} /></p></section>}
    <nav className="lesson-toc" aria-label="תוכן הפרק"><strong>בפרק הזה</strong><ul>{entry.sections.map((section, index) => <li key={section.title}><a className="text-link" href={`#section-${index}`}>{section.title}</a></li>)}<li><a className="text-link" href="#practice">תרגיל למחשבה</a></li><li><a className="text-link" href="#sources">מקורות והיקף האימות</a></li></ul></nav>
    <aside className="notice"><strong>{entry.verificationStatus === "verified" ? "המבוא נבדק מול מקור רשמי" : "התוכן ממתין לאימות"}</strong><p>{entry.verifiedAt && <>תאריך בדיקה: <time dateTime={entry.verifiedAt}><bdi>{entry.verifiedAt}</bdi></time> · </>}גרסה {entry.revision}</p><p>{entry.revisionNote}</p></aside>
    {entry.sections.map((section, index) => <section className="knowledge-section" id={`section-${index}`} key={section.title}><h2><KnowledgeText text={section.title} /></h2><p><KnowledgeText text={section.text} /></p></section>)}
    <section className="knowledge-section"><h2>דוגמה מהעולם הארגוני</h2><p><KnowledgeText text={entry.example} /></p></section>
    <section className="knowledge-section"><h2>תמיכת שפות וחלופות</h2><p><KnowledgeText text={entry.languageSupportNote} /></p><p><KnowledgeText text={entry.alternativesNote} /></p></section>
    <section className="notice" id="practice"><h2>תרגיל למחשבה</h2><p><KnowledgeText text={entry.exercise} /></p></section>
    {related.length > 0 && <section className="knowledge-section"><h2>להמשיך ללמוד</h2><ul>{related.map(item => <li key={item.slug}><Link className="text-link" href={`/tools/${item.slug}`}><bdi>{item.name}</bdi></Link></li>)}</ul></section>}
    <section className="knowledge-section" id="sources"><h2>מקורות והיקף האימות</h2><ul className="sources">{entry.sources.map(source => <li key={source.url}><a className="text-link" href={source.url}><KnowledgeText text={source.title} /></a><p><KnowledgeText text={source.supports} /></p><p className="card-meta">נבדק: <time dateTime={source.checkedAt}><bdi>{source.checkedAt}</bdi></time></p></li>)}</ul></section>
    {category && <Link className="button secondary" href={`/atlas/${category.id}`}>חזרה לקטגוריה</Link>}
  </article>;
}
