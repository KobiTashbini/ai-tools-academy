import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="AI TOOLS Academy — דף הבית">
          <span className="brand-icon" aria-hidden="true">א</span>
          <bdi>AI TOOLS <span>Academy</span></bdi>
        </Link>
        <nav aria-label="ניווט ראשי">
          <Link href="/">בית</Link>
          <Link href="/atlas">אטלס הידע</Link>
          <Link href="/search">חיפוש</Link>
          <Link href="/#learning">איך נלמד</Link>
        </nav>
      </div>
    </header>
  );
}
