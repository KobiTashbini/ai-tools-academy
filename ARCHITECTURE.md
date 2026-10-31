# AI TOOLS Academy — ארכיטקטורה מוצעת

> סטטוס: **פתוח להחלטה**. המסמך אינו הוראה להתחיל לפרוס שירותים.

## נקודת ייחוס: LinguaReader
מאגר: https://github.com/KobiTashbini/lingua-reader

קובצי הפרויקט שנבדקו מצביעים על:
- Next.js 16 + React 19 + TypeScript, Node.js ו־npm.
- API Routes בתוך Next.js.
- Vercel לאירוח, Supabase (PostgreSQL) לאחסון נתונים.
- OpenAI API.
- הגדרות מקומיות דרך `.env.local` והפעלה ב־`npm run dev`.
- אפשרות Demo Mode ללא חיבורי Supabase/OpenAI לפי README.

**ההגדרות בקוד אינן מוכיחות שמנוי ענן או פריסה מסוימת פעילים ברגע זה.** על Codex לבדוק את המצב בפועל דרך ההרשאות הזמינות; לא לבקש סודות בצ'אט.

## מועמד מועדף לבדיקה ב־V1
Next.js + TypeScript (React) / API Routes + Supabase PostgreSQL + Vercel, מתוך שיקולי מוכרות, פשטות, ופיתוח מקצה לקצה.

### חלופות שיש להשוות
- Next.js עם תוכן Markdown/JSON סטטי תחילה ורק לאחר מכן Supabase.
- Next.js Frontend + ASP.NET Core API נפרד (אם יש הצדקה עסקית/תפעולית).
- Background Worker ב־TypeScript, C# או Python בשלבי העשרת הידע.
- פתרון חלופי ש־Codex מצא מתאים יותר על בסיס יתרונות וחסרונות מוכחים.

## גבולות מערכת לוגיים
1. **UI:** Home, Atlas, Category, Tool Details, Compare.
2. **Domain/Content:** Categories, Tools, Languages, Sources, Content Documents, Versions.
3. **Data Access:** ממשק מוגדר לגישה לנתונים, שניתן להחליף בין Seed Data לבין DB בלי שכתוב UI.
4. **Knowledge Enrichment (עתידי):** Scheduler → Discover → Fetch → Verify → Draft → Human approval → Publish.
5. **Learning (עתידי):** Progress, quizzes, guided projects.

## החלטות ש־Codex צריך להציג
- האם להתחיל במצב Static-first או להקים מיד Supabase? לפי הצורך בעריכה, ניהול ותוכן דינמי.
- האם Next.js API Routes מספיקים ל־V1? באילו תנאים יש הצדקה ל־ASP.NET Core?
- מהי אסטרטגיית אחסון Markdown ותוכן מובנה? כיצד שומרים גרסאות ומקורות?
- כיצד להפעיל Jobs מתוזמנים וארוכי־ריצה בעתיד ללא הסתמכות שגויה על זמן הריצה של Web Requests?
- כיצד לנהל עלויות, הגבלות ספק, גיבויים, ניטור והרשאות?

## הפרדה ואבטחה
- אותם **ספקי שירות**, אם נבחרו, אך אפליקציית Vercel נפרדת, פרויקט Supabase נפרד ומפתחות נפרדים.
- מפתחות שרת לעולם לא ייחשפו בדפדפן או ב־Git.
- אין לגעת ב־LinguaReader או במשאביו בלי הרשאה מפורשת.
- Agent עתידי לא יפרסם תוכן ללא אישור וראיות ממקורות אמינים.

## כלל תכנון
להקים רק את מה שדרוש לפרוסת המוצר הנוכחית, ולתכנן נקודות הרחבה אמיתיות בלי מורכבות מוקדמת.
