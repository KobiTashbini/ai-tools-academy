# העברת עבודה — האתר קורא ישירות מהמסד

עודכן: 2026-11-01. נכתב בסיום עבודה עם Claude בשיחה מרוחקת, כדי שסוכן הבא (Claude Code מקומי) ימשיך מאותה נקודה. קרא גם את AGENTS.md, PROJECT_STATUS.md, TASKS.md (T-023) ו־docs/DECISIONS.md (D-027, D-028).

## מצב Git
- Branch: `feat/db-as-catalog-source-CLAUDE`, נפתח מ־`main` ב־a9391a3.
- Commit 558a937 (שלב 1, D-027): מיפוי הטבלאות למבני האתר, משתמש קריאה (מיגרציה 005), ייצוא לקובץ generated/catalog.json ובדיקת התאמה מול JSON.
  - נכנסו אליו בטעות גם תוצרי המחקר השבועי מאותו בוקר: research/proposals.json ו־research/runs/2026-11-01.md. אינם קשורים לשינוי; להחליט עם המשתמש אם לפצל.
- שינויים שלא נשמרו ב־Commit (שלב 2, D-028): העמודים שולפים ישירות מהמסד; הוסר קובץ הביניים.
  - יש להריץ `git rm scripts/export-catalog.mjs` (הקובץ הוחלף ב־scripts/check-catalog.mjs; מחיקה לא הייתה אפשרית מרחוק).
- לא בוצע Push. אין לבצע Push, פריסה או שינוי בענן ללא אישור מפורש.

## הארכיטקטורה כעת
- src/data/catalog-export.mjs — כל המיפוי מהסכמה academy למבנים KnowledgeEntry, ToolFacts, AgentMetric ומדריכי קטגוריה. מקבל פונקציית query, ולכן עובד עם pg ועם PGlite.
- src/data/db.mjs — Pool יחיד של pg, טרנזקציה אחת read only לכל טעינה. הגדרות: DATABASE_URL ו־DATABASE_SSL_CA (אופציונלי) מ־.env.local.
- src/data/catalog-cache.mjs — מטמון בתהליך לדקה; בכשל רענון מגיש נתון אחרון תקין; בטעינה ראשונה שנכשלת השגיאה עולה.
- src/data/catalog-source.ts → getCatalog(); knowledge.ts, catalog.ts ו־catalog-metrics.ts אסינכרוניים.
- שלושת העמודים (atlas, atlas/[categoryId], tools/[slug]) עם `export const revalidate = 300`.
- next.config.ts — `serverExternalPackages: ["pg"]`.
- database/005_build_reader.sql — role academy_build_reader: SELECT בלבד, RLS לפריטים שפורסמו ולשורות התלויות בהם; אין גישה ל־research_proposals, sources או לארכיון.

החלטות מיפוי שאסור לשבור בלי סיבה:
- Stars ופעילות בטבלה: המדידה האחרונה שיש בה last_activity_at. למאגרי 02 יש שתי מדידות באותו יום (09:13 עם פעילות, 09:33 של מדגם ה־Interest בלי פעילות).
- GitHub Interest: מחושב לכל מדגם מהמועד האחרון שלו, לא מה־View community_interest (שמעגל ל־2 ספרות).
- תאריכים מומרים ב־SQL (to_char או epoch ms) כדי שלא תהיה הסטת אזור זמן.
- תיאור הקטלוג ב־7 פריטי 02 הוא הנוסח הקומפקטי (מיגרציה 003); שדה facts.description אינו מוצג בממשק.

## מה נבדק
- 35 בדיקות `npm test` עברו בסביבה המרוחקת (Node 22, PGlite). כוללות התאמה מלאה של הייצוא, כמשתמש הקריאה, לכל מה שהאתר בנה מ־JSON; הרשאות 005; ומטמון.
- המשתמש הריץ ב־Supabase טביעת אצבע של סכמת academy: 152 עמודות, md5 95c482ee13fb618e9274747c31943a52 — זהה למיגרציות 001–004.

## מה לא נבדק — הצעדים הבאים לפי הסדר
1. `git rm scripts/export-catalog.mjs`
2. `npm install` (מוסיף את pg), `npm test`, `npm run typecheck`. לתקן שגיאות טיפוסים אם יש — זה לא הורץ מעולם על הקוד החדש.
3. Commit לשלב 2 באישור המשתמש.
4. המשתמש מריץ ב־SQL Editor את database/005_build_reader.sql ומגדיר סיסמה: `alter role academy_build_reader with login password '...'`. לא לבקש ממנו את הסיסמה ולא לקרוא את .env.local.
5. המשתמש יוצר .env.local לפי .env.example (Supabase → Connect → Session pooler; משתמש academy_build_reader.winnpnsmwkullbhrolan).
6. `npm run catalog:check` — מצופה: 12 categories, 35 published entries, 10 with GitHub Interest, 2 category guides.
7. `npm run build`, ואז `npm run start` ו־`npm run test:smoke` בחלון נוסף.
8. בדיקה חזותית: /atlas, /atlas/02, /atlas/08, /tools/mcp.

## צעדי המשך שלא בוצעו
- metrics:refresh, תהליך המחקר השבועי והבדיקות עדיין קוראים וכותבים content/*.json ו־research/proposals.json. העברתם למסד דורשת כתיבה ולכן role נפרד והחלטה חדשה.
- תהליך המחקר מ־2026-11-01 כבר מציין ש־generated/catalog.json חסר; אחרי D-028 הוא צריך לקרוא מהמסד (catalog:check מראה דרך).
- גיבוי חיצוני של המסד עדיין לא הוקם.
