import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategory, listCategories, listCategoryEntries } from "@/data/knowledge";
import { getCatalogFacts } from "@/data/catalog";
import { ToolCatalog } from "@/components/ui/tool-catalog";
import { getCatalogMetrics } from "@/data/catalog-metrics";
import guideData from "../../../../content/category-guides.json";
import { KnowledgeText } from "@/components/ui/knowledge-text";

const guides: Record<string, {title: string; intro: string; steps: {text: string; slug: string; label: string}[]; note: string}> = guideData;

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
  const guide = guides[category.id];
  return <section className="catalog agent-page">
    <nav className="breadcrumbs" aria-label="מיקום באתר"><Link href="/">בית</Link><span aria-hidden="true">/</span><Link href="/atlas">אטלס הידע</Link><span aria-hidden="true">/</span><span aria-current="page"><bdi>{category.name}</bdi></span></nav>
    <p className="eyebrow">תחום <bdi>{category.id}</bdi></p>
    <h1><bdi>{category.name}</bdi></h1><p className="intro">{category.description}</p>
    {guide && <section className="notice category-guide" aria-labelledby="category-guide-title">
      <h2 id="category-guide-title">{guide.title}</h2>
      <p><KnowledgeText text={guide.intro} /></p>
      <ol>{guide.steps.map(step => <li key={step.slug}><KnowledgeText text={step.text} /> <Link className="text-link" href={`/tools/${step.slug}`}>{step.label}</Link></li>)}</ol>
      <p><KnowledgeText text={guide.note} /></p>
    </section>}
    {entries.length ? <ToolCatalog key={category.id} entries={entries} facts={getCatalogFacts(entries.map(entry => entry.slug))} metrics={getCatalogMetrics(entries)} /> : <div className="notice"><h2>התוכן בתחום הזה בהכנה</h2><p>עדיין אין כאן פריטי ידע מפורסמים. אפשר בינתיים לקרוא את המבוא ל־<bdi>MCP</bdi> בתחום האינטגרציות.</p><Link className="text-link" href="/tools/mcp">למבוא על <bdi>MCP</bdi></Link></div>}
  </section>;
}
