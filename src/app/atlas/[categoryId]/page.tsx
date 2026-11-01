import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategory, getCategoryGuide, listCategories, listCategoryEntries } from "@/data/knowledge";
import { getCatalogFacts } from "@/data/catalog";
import { ToolCatalog } from "@/components/ui/tool-catalog";
import { getCatalogMetrics } from "@/data/catalog-metrics";
import { KnowledgeText } from "@/components/ui/knowledge-text";

type Props = { params: Promise<{ categoryId: string }> };
// Regenerate from the database at most every 5 minutes; the last good page is served if the database is unavailable.
export const revalidate = 300;
export async function generateStaticParams() { return (await listCategories()).map(category => ({ categoryId: category.id })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategory((await params).categoryId);
  return { title: category?.name ?? "קטגוריה לא נמצאה" };
}
export default async function CategoryPage({ params }: Props) {
  const category = await getCategory((await params).categoryId);
  if (!category) notFound();
  const entries = await listCategoryEntries(category.id);
  const slugs = entries.map(entry => entry.slug);
  const [guide, facts, metrics] = await Promise.all([getCategoryGuide(category.id), getCatalogFacts(slugs), getCatalogMetrics(entries)]);
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
    {entries.length ? <ToolCatalog key={category.id} entries={entries} facts={facts} metrics={metrics} /> : <div className="notice"><h2>התוכן בתחום הזה בהכנה</h2><p>עדיין אין כאן פריטי ידע מפורסמים. אפשר בינתיים לקרוא את המבוא ל־<bdi>MCP</bdi> בתחום האינטגרציות.</p><Link className="text-link" href="/tools/mcp">למבוא על <bdi>MCP</bdi></Link></div>}
  </section>;
}
