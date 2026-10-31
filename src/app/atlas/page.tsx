import Link from "next/link";
import type { Metadata } from "next";
import { listCategories, listCategoryEntries } from "@/data/knowledge";

export const metadata: Metadata = { title: "אטלס הידע" };

export default function AtlasPage() {
  return <section className="catalog" aria-labelledby="atlas-title">
    <p className="eyebrow">12 תחומים · מפה אחת</p>
    <h1 id="atlas-title">אטלס הידע</h1>
    <p className="intro">בחרו תחום כדי להכיר את המושגים, הכלים והקשרים שבו. בכל פרק תמצאו הסבר, דוגמה ארגונית, תרגיל ומקורות. מומלץ להתחיל ביסודות, להמשיך לעוזרי הפיתוח ואז למערכות סוכנים.</p>
    <div className="cards">{listCategories().map(category => {
      const count = listCategoryEntries(category.id).length;
      return <Link className="card category-card" href={`/atlas/${category.id}`} key={category.id}>
        <span className="step" dir="ltr">{category.id}</span>
        <h2><bdi>{category.name}</bdi></h2><p>{category.description}</p>
        <span className="card-meta">{count === 1 ? "פריט ידע אחד זמין" : count ? `${count} פריטי ידע זמינים` : "התוכן בהכנה"} <span aria-hidden="true">←</span></span>
      </Link>;
    })}</div>
  </section>;
}
