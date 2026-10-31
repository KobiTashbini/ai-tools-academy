import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategory, listCategories, listCategoryEntries } from "@/data/knowledge";
import { kindLabels } from "@/domain/knowledge";

type Props = { params: Promise<{ categoryId: string }> };
export function generateStaticParams() { return listCategories().map(category => ({ categoryId: category.id })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategory((await params).categoryId);
  return { title: category?.name ?? "קטגוריה לא נמצאה" };
}
export default async function CategoryPage({ params }: Props) {
  const category = getCategory((await params).categoryId);
  if (!category) notFound();
  const entries = listCategoryEntries(category.id);
  return <section className="catalog">
    <nav className="breadcrumbs" aria-label="מיקום באתר"><Link href="/">בית</Link><span aria-hidden="true">/</span><Link href="/atlas">אטלס הידע</Link><span aria-hidden="true">/</span><span aria-current="page"><bdi>{category.name}</bdi></span></nav>
    <p className="eyebrow">תחום <bdi>{category.id}</bdi></p>
    <h1><bdi>{category.name}</bdi></h1><p className="intro">{category.description}</p>
    {entries.length ? <div className="cards">{entries.map(entry => <Link href={`/tools/${entry.slug}`} className="card category-card" key={entry.id}><span className="badge">{kindLabels[entry.kind]}</span><h2><bdi>{entry.name}</bdi></h2><p>{entry.summary}</p><span className="card-meta">לקריאת הפריט <span aria-hidden="true">←</span></span></Link>)}</div> : <div className="notice"><h2>התוכן בתחום הזה בהכנה</h2><p>עדיין אין כאן פריטי ידע מפורסמים. אפשר בינתיים לקרוא את המבוא ל־<bdi>MCP</bdi> בתחום האינטגרציות.</p><Link className="text-link" href="/tools/mcp">למבוא על <bdi>MCP</bdi></Link></div>}
  </section>;
}
