# מחקר משלים — Sim, FastGPT, Coze וכלים סמוכים

תאריך: 2026-11-03. חוקר: הסוכן הראשי. checkedAt למסמכי Web: 2026-11-03T08:53:10Z–2026-11-03T08:54:58Z (חלון הבדיקה); זמני API מדויקים בקובץ visual06-github-retry-2026-11-03.json. הצעות בלבד. לא הופעלו התקנות/דוגמאות/מוצרי ענן.

## Sim — להוסיף, platform / should_know
זהות: Sim, לשעבר Sim Studio; simstudioai/sim והאתר sim.ai, לא מוצר חדש נוסף לכל שם. הערך המובחן: canvas לסוכנים וכלים לצד triggers, פריסה דרך API/chat/MCP ושילוב בקוד. התיעוד מציג SDK ל־Python ו־TypeScript; .NET יכול להתממשק ב־HTTP, לא אומת SDK .NET רשמי. המקורות: [מבוא](https://docs.sim.ai/introduction), [Python](https://docs.sim.ai/api-reference/python), [TypeScript](https://docs.sim.ai/api-reference/typescript), [אימות](https://docs.sim.ai/api-reference/authentication). v2 מבחין בין API keys לבין OAuth; המפתחות חייבים להישאר בשרת היישום. ביטחון גבוה ליכולות המתועדות, ללא בדיקת parity.

[Self-hosting](https://docs.sim.ai/platform/self-hosting) מציג Docker/Kubernetes, PostgreSQL, Redis ו־scheduler. זו מערכת לתפעול, לא node בודד; יש לגבות אחסון, DB ומפתחות ולהגדיר שירותי sandbox לפי השפה. [Architecture](https://docs.sim.ai/platform/self-hosting/architecture) משלים את הפרדת שירותי app/realtime/jobs. עלות כוללת תשתית, מודלים וחלק מהשירותים החיצוניים; בלי הבטחת חינם או ביצועים. [LICENSE](https://raw.githubusercontent.com/simstudioai/sim/main/LICENSE) הוא Apache-2.0 לליבה, ואילו [המבוא](https://docs.sim.ai/introduction) מציין רישיון Enterprise נפרד ליכולות Enterprise. העובדה שניתן להדליק flags ב־self-host אינה כשלעצמה הרשאת שימוש production.

גרסה: v0.9.41, יצאה 2026-11-03T01:35:21Z, prerelease=false ב־GitHub. מספר 0.x אינו מוכיח חוסר יציבות אך נדרש pinning ובדיקת migrations. 29,980 Stars; 3,880 Forks, מאגר לא מאורכב; head ב־2026-11-03. מדידות מדויקות ומקורות בקובץ API. תאריך השקה ראשון לא אומת; [פוסט חברה מ־2025-11-12](https://www.sim.ai/blog/series-a) מוכיח פעילות ב־2025 אך אינו תאריך השקה. אותו פוסט טוען 60,000+ מפתחים ו־100+ חברות באותו מועד; אלה טענות ספק היסטוריות, לא סקר אימוץ או נתון נוכחי. לא להעתיק 100,000 builders מה־README כמדד מאומת.

שימוש מוצע שלא הורץ: webhook של בקשת שירות → שליפת הקשר → החלטת מודל → בקשת אישור → קריאת ASP.NET API. מתאים ללמידת agent+workflow עם React/TypeScript; פחות מתאים כשכל הדרישה היא endpoint אחד ו־LLM call. חלופות: Dify למעטפת יישום/ידע, Langflow להרכבת רכיבים ב־Python, n8n הקיימת לאוטומציית מערכות כללית. ביטחון בהמלצה בינוני־גבוה; אין השוואת latency או עומס.

## FastGPT — מועמד העשרה, לדחות מהתוספות הראשיות
זהות: labring/FastGPT, platform; לא מודל GPT ולא FastAPI. [Workflows](https://doc.fastgpt.io/en/guide/build/workflow/intro) מתעד תזמור node-based עם חיפוש ידע, תנאים ופלט; [OpenAPI](https://doc.fastgpt.io/en/openapi/intro) מבהיר שמגרסה4.15.0 יש להשתמש בתיעוד המופק, ועמודי API ידניים ישנים אינם מתוחזקים. .NET דרך HTTP; תאימות למבנה OpenAI אינה הוכחת כיסוי כל היכולות או SDK C# ייעודי. מימוש TypeScript ניכר במאגר, והוא נפרד מתמיכת לקוח.

[Deployment](https://doc.fastgpt.io/en/self-host/deploy/docker) מציג MongoDB לצד אחסון וקטורים ו־AI Proxy; הדוגמאות שונות לפי מסלול אחסון. נמצאה סתירה בתיעוד הישן של Dataset המתאר נתוני טקסט ב־PostgreSQL מול מדריך הפריסה העדכני. יש להצמיד גרסה ולהימנע מטענה שכל הנתונים ב־PG. [LICENSE](https://raw.githubusercontent.com/labring/FastGPT/main/LICENSE) מבוסס Apache2 עם מגבלות SaaS דומה מרובה דיירים ומיתוג; אינו Apache2 נקי. ב־API: v4.17.3, 2026-11-01; מאגר פעיל, 29,982 Stars ו־7,367 Forks. יום ההשקה הראשון לא אומת. אין נתון שימוש חוצה כלים בר־השוואה. ביטחון גבוה לעובדות, בינוני להמלצה.

החלטה פדגוגית: enrichment, שימושיות גבוהה בתרחיש ידע+workflow, אך חפיפה ניכרת ל־Dify ול־RAGFlow שכבר בקטלוג; עדיף להשלים בסיס ולהשוות שתי מערכות לעומק לפני פלטפורמה שלישית דומה. אפשר לאשר בנפרד בשלב הבא.

## Coze Studio — לדחות, enrichment אם יתווסף
[README רשמי](https://raw.githubusercontent.com/coze-dev/coze-studio/main/README.md): עורך חזותי, workflows/agents/knowledge, backend Go ו־frontend React/TypeScript; APIs ו־Chat SDK. אין להסיק מכך SDK .NET או שוויון עם שירות Coze המסחרי. [מאגר](https://github.com/coze-dev/coze-studio) Apache2. [פוסט Coze Team ב־BytePlus מ־2025-07-29](https://www.byteplus.com/vi/blog/coze-open-sources-ai-agent-tools) מציין פתיחת קוד Coze Studio/Loop; זה אירוע פתיחת קוד ולא השקת Coze כולו. claims על מיליוני מפתחים מתייחסים לפלטפורמת המקור, לא למדגם אימוץ של Studio הפתוח.

API נמדד: v0.5.1 מ־2026-02-05, head2026-07-29, archived=false, 21,801 Stars ו־3,137 Forks. אין הודעת EOL מאומתת; פעילות ישנה יותר אינה הרשאה לסמן Legacy. התיעוד מזהיר מפורשות מפני חשיפה ציבורית ללא הקשחה. הנטל והתלות באינטגרציות/שירותים מסחריים מורידים את תועלת ההוספה המידית ביחס ל־Dify/Langflow. להשאיר ברשימת מעקב, לא לפסול את המוצר.

## כלי גילוי נוספים וגבולות קטגוריה
- [n8n AI](https://docs.n8n.io/advanced-ai/) אכן תומכת במודלים, כלים, זיכרון ו־MCP. כבר בקטלוג כ־n8n ב־03; המלצה לקישור במדריך, בלי כפילות רשומה. לא נחקרו כל פרטי n8n מחדש.
- [LangSmith Studio](https://docs.langchain.com/langsmith/studio): IDE להמחשה, הרצה ודיבוג של מערכות התומכות ב־Agent Server API. אינו תחליף אוטומטי ל־canvas ליצירת יישום. LangGraph כבר בקטלוג; אין להוסיף אותו מחדש בשם היסטורי LangGraph Studio. הרחבה ל־02/10 היא מחקר המשך.
- [BuildShip](https://docs.buildship.com/) מציג backend APIs/cron/DB triggers והרחבת JS/TS. מתאים יותר לסקירת03; לא נבדקו רישוי, תמחור ומצב תפעולי במידה המספיקה להוספה. לדחות עם נימוק חפיפת תפקיד.
- [Opal announcement](https://developers.googleblog.com/en/introducing-opal/) מ־2025-07-24: public beta ניסיוני לבניית mini-apps. זהו מצב היסטורי, לא הוכחה למצב או זמינות בישראל ב־2026. לדחות עד בדיקת המוצר העדכני; בלי לסמן נטוש ובלי להבטיח API/self-host.

## חיפוש וגישה
בוצעו חיפושי גילוי לפי visual agent workflows, open-source, API backend, self-hosting, SDK ופתיחת קוד; נפתחו מסמכי מוצר, רישיונות, API ופריסה. API ציבורי נכשל תחילה ב־DNS/network בסנדבוקס והצליח בהרשאה מתאימה. שתי כתובות Sim SDK משוערות החזירו שגיאה; נפתרו דרך קישורי התיעוד ל־api-reference/python ו־typescript. לא הסתמכנו על מראות docs או רשימות השוואה חיצוניות. אין benchmark, בדיקת התקנה, בדיקת עברית, סקר משתמשים בר־השוואה או בדיקת אבטחה מעשית.

## השלמת גילוי — OpenAI Agent Builder
checkedAt: 2026-11-03T08:56:00Z בקירוב. [מדריך רשמי](https://developers.openai.com/api/docs/guides/agent-builder), [Deprecations](https://developers.openai.com/api/docs/deprecations), [Migration](https://developers.openai.com/api/docs/guides/agent-builder/migrate-from-agent-builder) נפתחו. Agent Builder הוא canvas חזותי, אך deprecated מ־2026-06-03 וסגירה מתוכננת ל־2026-11-30. לכן לא להוסיף כהמלצה פעילה. ChatKit נשאר זמין; אין להציג את כולו כנטוש. אפשר להזכיר ביסודות כסיכון תלות במחזור חיי פלטפורמה. נתיבי ההמשך הרשמיים הם Agents SDK או ChatGPT Workspace Agents; אין להבטיח המרה אוטומטית או שימור דטרמיניזם. Agents SDK כבר בקטלוג02 — אין להוסיף שוב SDK כרשומת builder06. הסקירה נשענה גם על skill OpenAI Docs. ביטחון גבוה בציר הזמן המתועד, שעשוי להתעדכן בעתיד.
