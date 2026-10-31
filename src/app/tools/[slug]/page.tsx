import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategory, getEntry, listPublishedEntries } from "@/data/knowledge";
import { kindLabels } from "@/domain/knowledge";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return listPublishedEntries().map(entry => ({ slug: entry.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = getEntry((await params).slug);
  return { title: entry?.name ?? "פריט לא נמצא", description: entry?.summary };
}
export default async function ToolPage({ params }: Props) {
  const entry = getEntry((await params).slug);
  if (!entry) notFound();
  const category = getCategory(entry.categoryIds[0]);
  return <article className="catalog detail">
    <nav className="breadcrumbs" aria-label="מיקום באתר"><Link href="/">בית</Link><span aria-hidden="true">/</span><Link href="/atlas">אטלס הידע</Link>{category && <><span aria-hidden="true">/</span><Link href={`/atlas/${category.id}`}><bdi>{category.name}</bdi></Link></>}<span aria-hidden="true">/</span><span aria-current="page"><bdi>{entry.name}</bdi></span></nav>
    <p className="eyebrow">{kindLabels[entry.kind]}</p><h1><bdi>{entry.name}</bdi></h1><p className="intro">{entry.summary}</p>
    <aside className="notice"><strong>{entry.verificationStatus === "verified" ? "המבוא נבדק מול מקור רשמי" : "התוכן ממתין לאימות"}</strong><p>{entry.verifiedAt && <>תאריך בדיקה: <time dateTime={entry.verifiedAt}><bdi>{entry.verifiedAt}</bdi></time> · </>}גרסה {entry.revision}</p><p>{entry.revisionNote}</p></aside>
    {entry.sections.map(section => <section className="knowledge-section" key={section.title}><h2>{section.title}</h2><p>{section.text}</p></section>)}
    <section className="knowledge-section"><h2>דוגמה מהעולם הארגוני</h2><p>{entry.example}</p></section>
    <section className="knowledge-section"><h2>תמיכת שפות וחלופות</h2><p>{entry.languageSupportNote}</p><p>{entry.alternativesNote}</p></section>
    <section className="notice"><h2>תרגיל למחשבה</h2><p>{entry.exercise}</p></section>
    <section className="knowledge-section"><h2>מקורות והיקף האימות</h2><ul className="sources">{entry.sources.map(source => <li key={source.url}><a className="text-link" href={source.url}>{source.title}</a><p>{source.supports}</p><p className="card-meta">נבדק: <time dateTime={source.checkedAt}><bdi>{source.checkedAt}</bdi></time></p></li>)}</ul></section>
    {category && <Link className="button secondary" href={`/atlas/${category.id}`}>חזרה לקטגוריה</Link>}
  </article>;
}
