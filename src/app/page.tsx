import Link from "next/link";

const steps = [
  { number: "01", title: "מבינים את המפה", text: "מבדילים בין מודלים, SDKs, מסגרות עבודה ופרוטוקולים, ומבינים איך הם מתחברים." },
  { number: "02", title: "בוחרים מתוך הבנה", text: "בוחנים את הבעיה, החלופות והפשרות, עם חיבור לידע קודם בפיתוח ובארכיטקטורה." },
  { number: "03", title: "בונים ובודקים", text: "מתקדמים בפרוסות קטנות, מסבירים החלטות ומוודאים שהתוצאה עובדת." },
];

export default function HomePage() {
  return (
    <>
      <section className="hero" aria-labelledby="home-title">
        <p className="eyebrow">מרחב למידה למפתחים מנוסים</p>
        <h1 id="home-title">מהיכרות עם AI<br /><span>להבנה הנדסית.</span></h1>
        <p className="intro">להבין את הכלים, לבחור את הארכיטקטורה ולבנות מערכות שעובדות. אטלס ידע בעברית לפיתוח באמצעות AI, להנדסת AI ולמערכות סוכנים.</p>
        <div className="actions">
          <Link className="button primary" href="/atlas">לגלות את אטלס הידע <span aria-hidden="true">←</span></Link>
          <a className="button secondary" href="#learning">להכיר את דרך הלמידה</a>
        </div>
        <div className="hero-notes"><span>12 תחומי ידע</span><span>עברית מהיסוד</span><span>למידה דרך בנייה</span></div>
      </section>
      <section id="learning" className="learning" aria-labelledby="learning-title">
        <p className="eyebrow">הדרך שלנו</p>
        <h2 id="learning-title">מפת ידע שהופכת לעבודה מעשית</h2>
        <p className="section-intro">מתחילים מהיסודות ומחברים כל החלטה לניסיון שלך בקוד, בנתונים ובמערכות.</p>
        <div className="cards">{steps.map(step => <article className="card" key={step.number}><span className="step" dir="ltr">{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
      </section>
      <aside className="notice"><strong>מתחילים ללמוד מתוך האטלס</strong><p>פרקי לימוד בכל 12 התחומים: הסברים, דוגמאות מהעולם הארגוני ותרגילים. חיפוש והשוואה יתווספו בהמשך.</p><Link className="text-link" href="/tools/llm-fundamentals">להתחיל מיסודות מודלי השפה</Link></aside>
    </>
  );
}
