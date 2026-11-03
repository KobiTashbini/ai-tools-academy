# מחקר משנה — כלים ארגוניים ומנוהלים ב־Visual AI Builders

מזהה: visual06-enterprise-20261103-v1. תאריך: 2026-11-03. checkedAt: 2026-11-03T08:55:53.477Z.
חוקר: visual_enterprise, סוכן משנה של מחקר catalog-research; מסמך מחקר והצעות בלבד, ללא ביקורת עצמאית של מסמך זה. לא בוצעו התקנות, רכישות, פריסה או שינוי קטלוג.

## בסיס והיקף

נקרא בסיס חי research/evidence/visual06-baseline-2026-11-03.json שנאסף ב־2026-11-03T08:52:38.037Z. נבדקו כל 57 הזהויות למניעת כפילות: ב־06 נמצאת Dify בלבד (revision 2; platform; should_know; published); microsoft-foundry ו־google-vertex-ai כבר קיימות. אין הצעות במסד בבסיס. מחקר Dify/Flowise/Langflow באחריות סוכן הליבה; כאן נבדקו ארבעה מועמדים מעשיים: Microsoft Copilot Studio, Botpress, Voiceflow ו־Google Agent Studio. התגלתה גם הבחנה נדרשת מול Google CX Agent Studio.

חיפושי גילוי: visual enterprise agent builder; Copilot Studio graphical/SDK/licensing/DLP; Botpress current Cloud/ADK/self-host; Voiceflow visual REST/voice/billing; Google visual Agent Studio/Agent Designer/Agent Builder naming. מקור שיווקי משמש זיהוי יכולת/אירוע וטענת ספק בלבד. אין מדגם משתמשים עצמאי משותף לארבעת השירותים. לכן אין כאן דירוג תפוצה מספרי או פופולריות משוער.

## המלצות ממוקדות

| מועמד | מצב נוכחי → הצעה | חשיבות למפתח | שימושיות והבחנה | ביטחון |
|---|---|---|---|---|
| Microsoft Copilot Studio; slug מוצע microsoft-copilot-studio | חסר → להוסיף platform ל־06; should_know | היכרות בעלת ערך גבוה למפתח .NET בארגון Microsoft; אינו חובה לכל מפתח AI | סוכנים וזרימות עם שירותי ארגון, Teams/Power Platform, ניהול זהויות ונתונים; אינו Foundry או Microsoft Agent Framework | גבוה ליכולות המתועדות; בינוני להתאמה ללא הכרת סביבת המשתמש |
| Botpress (Cloud/Studio); slug botpress | חסר → להוסיף platform ל־06; should_know | ממחיש תכנון שיחה, ערוצים, ידיעת מצב והעברה לנציג | Studio חזותי מנוהל לצד הרחבות TypeScript; חזק כתרגיל לשירות לקוחות/אתר, חופף חלקית ל־Dify | גבוה לזהות/אירוח/ממשקים; אין בדיקת איכות בפועל |
| Voiceflow; slug voiceflow | חסר → תוספת אופציונלית platform; enrichment | מתאים למסלול עיצוב שיחות/voice ועבודה עם צוות מוצר; לא חובה בנוסף ל־Botpress | ממחיש chat/טלפוניה, workflow מול playbook ומחזור פרסום ובדיקות דרך API | גבוה ליכולות; בינוני להעדפתו על Botpress ללא POC |
| Google Agent Studio בתוך Gemini Enterprise Agent Platform | כבר קיימת רשומת הפלטפורמה google-vertex-ai → הרחבת הפרק והפניה מ־06; לא ליצור עותק ספק | should_know בהקשר Google Cloud; ללמוד לאחר יסודות, לא מחייב כלי נוסף | מעבר מ־visual flow לקוד Python ו־runtime משותף; תכונת design agents מסומנת Preview | גבוה לשם/Preview; היקף alias/שיוך דורש בדיקת תוכן הרשומה הקיימת לפני החלה |

סדר היכרות מוצע למסלול ארגוני: יסודות גבולות visual/code והרשאות → Dify או כלי ליבה אחד → Copilot Studio אם קיים Microsoft tenant → Botpress למוצר שיחתי → Voiceflow כשיש צורך voice/צוות עיצוב → Agent Studio אם Google Cloud נבחר. זהו סדר פדגוגי שלנו, לא מדד שוק. אין חובה ללמוד את כל הכלים לעומק.

## Microsoft Copilot Studio — עובדות והצעה

זהות: מוצר SaaS חזותי low-code של Microsoft. לפי overview הוא כולל agents, workflows ו־agent flows; תכונת Apps ויצירה בשפה טבעית מסומנות preview במפורש. אין להציג כל יכולת חדשה כאילו זמינה בכל tenant/harness. [Overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio).

שפות ואינטגרציה: Microsoft 365 Agents SDK מספק ספריית client ודוגמאות רשמיות .NET, JavaScript ו־Python. המגבלה הנוכחית: client זה תומך בסוכנים שנוצרו עם standard harness; GitHub Copilot harness אינו נתמך בו רשמית עדיין. מדובר ב־client לצריכת סוכן ולא בניית כל מנוע Copilot Studio ב־C#. [Integrate with Copilot Studio](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/integrate-with-mcs). Direct Line ו־iframe הם מסלולים נפרדים: ה־iframe ברירת מחדל דורש No authentication, ולכן אינו חלופה זהה ליישום ארגוני מזוהה; לא לשנות אימות רק כדי לבדוק חיבור. [Web/native integration](https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-integrate-web-or-native-app-m365-agents-sdk).

אבטחה: התיעוד מציג data policies על ידע, HTTP, connectors וערוצים; שילוב Agent 365 מותנה ב־onboarding ארגוני. אלה יכולות ניהול ולא הוכחה שתצורת סוכן מסוים בטוחה. [Security/governance](https://learn.microsoft.com/en-us/microsoft-copilot-studio/security-and-governance). יש להפריד Entra של maker/agent/end-user ולשמור פעולות עסקיות רגישות מאחורי API שמאמת הרשאות בצד שרת.

עלות ותחזוקה: בשכבת standard harness קיימים Copilot Credits במסלולי pay-as-you-go/רכישה מראש; trial מאפשר בנייה ובדיקה אך לא פרסום. אין כאן מחיר נקוב או טענה שרישיון Microsoft 365 מכסה כל שילוב. [Licensing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing). השירות מתעדכן ברציפות: דף what's new מבחין GA ו־Preview; אין גרסת engine הניתנת ל־pinning מקומי. [What's new](https://learn.microsoft.com/en-us/microsoft-copilot-studio/whats-new).

השקה מאומתת: 2023-11-15, הכרזת/זמינות Microsoft Copilot Studio בשם זה. אין לייחס את היום לתחילת Power Virtual Agents או ל־GA של כל יכולות 2026. [הודעת ההשקה](https://www.microsoft.com/en-us/copilot/blog/2023/11/15/introducing-microsoft-copilot-studio-and-new-features-in-copilot-for-microsoft-365/).

דוגמה מוצעת שלא הורצה: עובד ב־Teams שואל על נוהל ומבקש לפתוח קריאה; ידע ארגוני ממוסמך ופעולת ASP.NET Core שמאמתת זהות ואישור לפני כתיבה. חלופה: React + שירות AI בקוד כשנדרשים portable runtime, לוגיקה מורכבת או שליטה שאינה מתאימה למגבלות Power Platform.

## Botpress — עובדות והצעה

Studio הוא IDE חזותי drag-and-drop לסוכנים וצ'אטבוטים, עם workflows/nodes/cards/knowledge/tables/variables. [Studio](https://botpress.com/docs/studio/introduction/). פריסה חדשה היא Botpress Cloud: v12 וגרסאות self-hosted מסומנות sunset ואינן מוצעות לרכישה/הורדה/פריסה חדשה; לקוחות v12 עם מנוי פעיל אינם בהכרח ללא תמיכה. לכן לא לסמן את המוצר הנוכחי Legacy, ולא להמליץ כיום להתקין v12. [מדיניות v12](https://botpress.com/docs/studio/guides/advanced/v12/).

שפות: מסלול ADK הנוכחי הוא TypeScript (בדף נצפית כותרת ADK v2.0.0), עם conversations/workflows/tools בקוד ו־hosting/scaling/channels בענן. רכיבי React מותאמים קיימים ב־webchat לפי התיעוד. זהו מסלול נפרד מ־SDK integrations הוותיק; אין להבטיח round-trip עריכה בין קוד ל־Studio. [ADK](https://botpress.com/docs/adk-v2/get-started/introduction/). Chat API מאפשר HTTP לסוכנים פרוסים ודורש Chat Integration; .NET יכול לצרוך HTTP, אך לא אומת כאן SDK .NET רשמי. [API](https://botpress.com/docs/api-reference/).

רישיון וזהות מאגר: README של botpress/botpress מתאר monorepo של Cloud integrations/devtools/דוגמאות/plugins, עם MIT לחבילות שבמאגר. הוא מפנה ל־v12 repository אחר. MIT של חבילות אינו רישיון self-host של שירות הענן. Stars של מאגר זה משקפים עניין בקוד הציבורי הזה; אין לפרש כמשתמשי Studio או לערבב עם v12. [המאגר הרשמי](https://github.com/botpress/botpress).

תמחור: הדף הנוכחי מציג plans מבוססי conversations ומכסת AI usage/אחסון ותוספות; יש לברר עלות תרחיש אמיתי ולא להשתמש בזיכרון של מחיר ישן. פרטי RBAC/שיתוף ותכונות Enterprise תלויים מסלול. [Pricing](https://botpress.com/pricing). תחזוקה: changelog כולל רשומה מתוארכת 2026-10-30; זהו סימן עדכונים לשירות, לא התחייבות אבטחה או גרסת מוצר שנבדקה. [Changelog](https://botpress.com/docs/changelog/). מועד ההשקה הראשונית של Cloud לא אומת — להשאיר חסר, ולא לגזור מ־v12 או יצירת GitHub.

דוגמה מוצעת שלא הורצה: עוזר אתר React לאיתור הזמנה, אימות לקוח דרך backend .NET, ו־handoff כאשר חסר אישור/מידע. חלופה: Dify לזרימות AI וידע כלליות או מימוש code-first כאשר בדיקות, portability ושליטה בריצה חשובות יותר מזמן בניית השיחה.

## Voiceflow — עובדות והצעה אופציונלית

המסמכים מתארים בנייה חזותית של סוכני customer experience עם chat/טלפוניה, knowledge ו־handoff. זו פלטפורמה עצמאית, לא alias של Botpress. [Documentation](https://www.voiceflow.com/docs). REST API מאפשר הרצת שיחות ב־HTTP, ניהול סביבת פרסום, QA ותצפית; מתאים ל־.NET דרך HTTP. אין בדוח זה הוכחה ל־SDK .NET רשמי או ל־feature parity בין API ל־Studio. [API overview](https://www.voiceflow.com/docs/api-reference/api-overview).

התמחור הוא plan + add-ons כגון editor seats/מספרי טלפון + credits משותפים בארגון; Free מתואר כמענק חד פעמי לא מתחדש; Enterprise כולל אפשרויות private cloud ו־SSO לפי תנאים. private cloud אינו הוכחה לקוד פתוח או התקנה עצמית חופשית. [Billing](https://www.voiceflow.com/docs/documentation/account-management/billing). Changelog מציג עדכונים עד 2026-10-31 ומציין Core 4.2 ב־2026-09-16; אין להסיק מזה גרסה אחידה של כל השירות. [Changelog](https://www.voiceflow.com/docs/changelog/changelog).

לא אומת תאריך השקה ראשוני ולא נמצא מדד משתמשים בר־השוואה לכלים האחרים; אין להזין אפס או SDK Stars. המלצה: enrichment או לדחות אם Botpress כבר נותן מספיק כיסוי שיחתי. ערך מובחן יעלה אם נדרש תרגול voice, מעצב שיחות שאינו מפתח, או שיתוף מוצר. דוגמה מוצעת שלא הורצה: תכנון ניתוב שיחה טלפונית/אתר עם אימות API לפני פעולת CRM; איכות קול בעברית ו־RTL לא נבדקה.

## Google — הבחנת שמות, כפילות וגבולות

Agent Studio הוא visual designer בקונסולת Google Cloud; דף Design agents מסמן את התכונה Preview ו־Pre-GA terms, ומציין יצירת flow, בדיקה, Get code ויצוא Python, וכן אחסון קובצי configuration ב־us-west1. משמעות מיקום זו מחייבת בדיקת התאמה למדיניות ארגונית ואינה טענה שכל הנתונים רצים רק שם. [Design agents](https://docs.cloud.google.com/gemini-enterprise-agent-platform/agent-studio/design-agents?hl=en).

קיים אירוע 2026-04-22: release notes מתעדים מעבר שמות Vertex AI→Gemini Enterprise Agent Platform ו־Vertex AI Studio→Agent Studio. זהו אירוע שינוי שם/הרחבת פלטפורמה, לא תאריך ההשקה המקורית של Vertex AI ולא הוכחת GA של visual agent design. [Release notes](https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes). הכרזת Next26 מציגה Agent Studio כ־low-code לבנייה/בדיקה/פרסום וממקמת אותו בתוך אותה פלטפורמה; אין ליצור מזה ספק ענן נוסף. [Next26](https://cloud.google.com/blog/topics/google-cloud-next/welcome-to-google-cloud-next26?hl=en).

נמצא גם CX Agent Studio במסלול Gemini Enterprise for Customer Experience: release notes שלו מציינים GA ב־2026-02-04 ועדכונים ב־2026-10-22. זהו מוצר CX נפרד מה־design agents Preview ב־Agent Platform; אין להעביר את תאריך ה־GA שלו ל־Agent Studio הכללי. [CX release notes](https://docs.cloud.google.com/gemini-enterprise-cx/cx-agent-studio/resources/release-notes). מומלץ לדחות רשומה נוספת עד מסלול CX ייעודי, ולכלול כרגע הבהרת זהות בהשוואה בלבד.

מבחינת הקטלוג: עדיפות להצעה לתיקון/הרחבת google-vertex-ai והוספת שיוך 06 רק אם הפרק יורחב לתוכן לימודי מתאים. בשלב המחקר לא שונתה זהות, קטגוריה או רשומה קיימת. שפה: אין להסיק מ־Google Cloud SDK כללי שקיים API .NET זהה ל־Python code הנוצר מה־visual builder. יש לבדוק דרך ההפעלה שנבחרת לפני ציון native SDK.

## דירוגים ללא ערבוב מדדים

חשיבות למפתח הארגוני המתואר: Copilot Studio ו־Botpress should_know; Voiceflow enrichment; Agent Studio should_know בהקשר ענן Google קיים. שימושיות מעשית תלויה תרחיש: Copilot Studio ראשון ל־M365/Entra; Botpress לשיחת אתר וערוצים מנוהלים; Voiceflow למסלול voice ועיצוב; Agent Studio למעבר visual→Python בתוך Google Cloud. אלו המלצות, לא תוצאות benchmark.

פופולריות: unknown/not_comparable לכל ארבעת שירותי הענן. אין סקר רשמי בעל אותה אוכלוסייה/שאלה/שנה שנבדק כאן. טענות vendor adoption או לקוחות בשיווק אינן נתח שוק; לא נוצר composite score. לא נאספו מדדי GitHub בסוכן זה — האיסוף מרכזי אצל הסוכן הראשי.

## כיסוי, מגבלות וגבול אישור

נבדקו 4/4 המועמדים שהוקצו במחקר מקורות רשמיים; CX Studio נבדק כגבול טקסונומי ולא מועמד להוספה בסבב זה. זהויות כל 57 הרשומות נבדקו, אך תוכן הפרקים הקיימים מחוץ ל־06 לא עבר audit מלא. אין טענת אימות מוצר בפועל, אבטחה, ביצועים, איכות עברית, עלות כוללת או parity. חלק מ־Microsoft Learn מציג banner authorization אף שגוף המסמך נגיש; הטענות נשענות על הגוף שנפתח. קישור Botpress control-access נכשל בפתיחה חוזרת ולכן לא שימש לביסוס טענת אבטחה פרטנית. מקורות מאותו ספק אינם אישוש עצמאי.

המלצות אלה יועברו לדוח הראשי ולביקורת עצמאית; אין אישור משתמע לפרסום, וגרסאות/מחירים/תכונות Preview דורשים בדיקה חוזרת לפני יישום. כל חומר המחקר נשמר ב־research/ בלבד.
