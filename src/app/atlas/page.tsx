import Link from "next/link";
import type { Metadata } from "next";
import { listCategories, listPublishedEntries } from "@/data/knowledge";

export const metadata: Metadata = { title: "אטלס הידע" };
// Regenerate from the database at most every 5 minutes; the last good page is served if the database is unavailable.
export const revalidate = 300;

export default async function AtlasPage() {
  const [categories, entries] = await Promise.all([listCategories(), listPublishedEntries()]);
  return <section className="catalog" aria-labelledby="atlas-title">
    <p className="eyebrow">12 תחומים · מפה אחת</p>
    <h1 id="atlas-title">אטלס הידע</h1>
    <p className="intro">בחרו תחום כדי להכיר את המושגים, הכלים והקשרים שבו. בכל פרק תמצאו הסבר, דוגמה ארגונית, תרגיל ומקורות. מומלץ להתחיל ביסודות, להמשיך לעוזרי הפיתוח ואז למערכות סוכנים.</p>
    <div className="cards">{categories.map(category => {
      const count = entries.filter(entry => entry.categoryIds.includes(category.id)).length;
      return <Link className="card category-card" href={`/atlas/${category.id}`} key={category.id}>
        <span className="step" dir="ltr">{category.id}</span>
        <h2><bdi>{category.name}</bdi></h2><p>{category.description}</p>
        <span className="card-meta">{count === 1 ? "פריט ידע אחד זמין" : count ? `${count} פריטי ידע זמינים` : "התוכן בהכנה"} <span aria-hidden="true">←</span></span>
      </Link>;
    })}</div>
  </section>;
}
