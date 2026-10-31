import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "AI TOOLS Academy — ללמוד, להבין, לבנות", template: "%s | AI TOOLS Academy" },
  description: "אטלס ידע בעברית למפתחים: פיתוח באמצעות AI, הנדסת AI ומערכות סוכנים.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <a className="skip-link" href="#main">דלג לתוכן</a>
        <SiteHeader />
        <main id="main" className="container">{children}</main>
        <footer className="container footer">לומדים לעומק. בונים בהדרגה. בודקים את המקורות.</footer>
      </body>
    </html>
  );
}
