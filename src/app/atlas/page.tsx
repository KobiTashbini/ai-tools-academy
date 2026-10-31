import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "אטלס הידע" };

export default function AtlasPage() {
  return <section className="hero"><p className="eyebrow">הצעד הבא</p><h1>אטלס הידע<br /><span>מתחיל כאן.</span></h1><p className="intro">כאן תופיע מפת 12 תחומי הידע, עם כלים, מושגים וקשרים ביניהם. המסך נמצא בהכנה; התוכן יתווסף בשלב הבא.</p><Link className="button secondary" href="/">חזרה לבית</Link></section>;
}
