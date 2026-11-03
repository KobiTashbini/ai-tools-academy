# המלצות לקטגוריה 06 — Visual AI Builders

מזהה דוח: **visual06-20261103-v1**. תאריך: 2026-11-03. סטטוס: **pending_review; approval=null**. זהו מחקר והמלצות לאישור, לא תוכן שהוחל.

## בסיס חי, כיסוי ושיטת המחקר

קריאה מהקטלוג הפעיל ב־Supabase דרך readDatabaseCatalog ובטרנזקציות repeatable read/read only הושלמה ב־2026-11-03T08:52:38.037Z (10:52 בישראל; כל57 הזהויות בבסיס היו published). נבדקו **57 זהויות בכל סטטוס** למניעת כפילות: slug, שם, סוג, revision, מצב פרסום ומאגר. ה־loader מחזיר תוכן עשיר של רשומות published בלבד; אין כאן audit תוכן מלא של רשומות לא מפורסמות. ב־06 יש **רשומה אחת, Dify revision2, platform, should_know, published/verified**, ואין מדריך קטגוריה. נבדקה **1/1** רשומת התחום. תור ההצעות המקומי והטבלה במסד ריקים בבסיס; דוח Vector05 הקודם אינו אישור לתחום06.

אינדקס המקורות: [47 כתובות ראשוניות](../evidence/visual06-source-index-2026-11-03.json). צילום הבסיס: [visual06-baseline](../evidence/visual06-baseline-2026-11-03.json). מדידות GitHub: [צילום API מוצלח](../evidence/visual06-github-retry-2026-11-03.json). ניסיון הרשת הראשון הכושל נשמר בנפרד; לא הוצג כרענון נתונים. שם/slug/repository נבדקו מול כל הקטלוג, כולל n8n, RAGFlow, LangGraph, Google Vertex/Agent Platform, Microsoft Foundry ו־OpenAI Agents SDK. לא נמצאה כפילות לתוספות המומלצות.

צוות: visual_core חקר Dify/Langflow/Flowise; visual_enterprise חקר Copilot Studio/Botpress/Voiceflow/Google; הסוכן הראשי חקר Sim/FastGPT/Coze וכלים סמוכים ואסף מדדים; visual_review ביצע ביקורת עצמאית ומקורות מפתח. מקורות מאותו ספק הם ראיות ראשוניות, לא אישוש בלתי תלוי. אין שינוי טקסונומיית00–11.

נבדקו לעומק **10 פלטפורמות ייחודיות**: Dify, Langflow, Flowise, Sim, FastGPT, Coze Studio, Copilot Studio, Botpress, Voiceflow, Google Agent Studio. בנוסף נבדקו נקודתית OpenAI Agent Builder, n8n, LangSmith Studio, BuildShip ו־Opal כדי להכריע תחזוקה/חפיפה/גבולות. CX Agent Studio נבדק כהבחנת זהות. זו אינה טענת כיסוי של כל שוק ה־low-code.

חיפושי גילוי לפי תפקיד: visual AI agent/workflow builder; self-hosted/open-source canvas; Python components; TypeScript/API/MCP workflows; enterprise Microsoft/Google; conversational/voice UX; API backend builder; תחזוקה/EOL; רישוי ו־SDK. הפניות מפוסטים ורשימות שימשו כיווני חיפוש; הטענות נשענות על מסמכים שנפתחו.

## מסקנה והיקף מומלץ

המלצה: להוסיף **פרק יסודות וארבע פלטפורמות — Langflow, Copilot Studio, Sim ו־Botpress**, להרחיב את Dify הקיימת וליצור מדריך. אם כולן יאושרו, ב־06 יהיו **שש רשומות**: פרק יסודות, Dify וארבע הפלטפורמות החדשות; בכל הקטלוג יהיו62 רשומות. אין צורך ללמוד כל פלטפורמה לעומק; מומלץ לבחור אחת לתרגול ולהשתמש ביתר להשוואה.

הדירוג להלן הוא המלצה פדגוגית למפתח מנוסה עם C#/.NET, React, SQL ו־REST. שימושיות מתוארת לפי תרחיש. פופולריות נמדדת בנפרד דרך Stars של מאגר מייצג כאשר יש כזה; אין ציון משוקלל, נתח שוק או נתון משתמשים אחיד שהומצא.

## הצעות לאישור — חבילה ראשית

| מזהה | פעולה וזהות | לפני → אחרי מוצע | חשיבות ומיקום לימודי | נימוק/חלופה/ביטחון |
|---|---|---|---|---|
| V06-01 | הוספת visual-ai-builders-fundamentals; concept; 06 | חסר → ״בניית AI חזותית — יסודות ובחירת כלי״; חמישה סעיפים: graph/state/data contracts; deterministic flow מול agent; API ואימות; בדיקות/evals/errors; פריסה/עלות/רישוי/ניוד | must_learn; ראשון | ידע שנשאר שימושי כשהמוצר מתחלף. prerequisites HTTP/JSON ויסודות LLM. חלופה לתרגיל ראשון: ASP.NET endpoint קטן ולא runtime חדש. ביטחון גבוה בהמלצה הפדגוגית |
| V06-02 | הרחבת dify; revision2; platform | פרק כללי ומקור יחיד → הבחנת Workflow/Chatflow/Agent, REST בצד שרת, Python/JS nodes מול שפת ליבה, Cloud/self-host, רישוי מוגבל ותרחישי בחירה; שימור התוכן/המקורות הישנים והוספת הבהרות | should_know ללא שינוי; שני | דוגמה רחבה ליישום AI עם ידע ותהליך. אין צורך להפוך ל־must_learn בגלל Stars. להחליף אזכור Flowise כחלופה פעילה בהערת EOL ולהשוות ל־Langflow. ביטחון גבוה לעובדות, בינוני־גבוה להתאמה |
| V06-03 | הוספת langflow; platform; 06 | חסר → ״Langflow״: גרף רכיבים, הרחבת Python, RAG/agents ו־REST; MIT; בידוד תשתיתי | should_know; שלישי | להבין רכיבים ולצאת לקוד. .NET דרך HTTP; SDK C# רשמי לא אומת. אם נדרש רק מוצר ידע ללא הרחבת רכיבים, Dify עשויה להספיק. ביטחון גבוה |
| V06-04 | הוספת microsoft-copilot-studio; platform; 06 | חסר → ״Microsoft Copilot Studio״: agents/workflows, חיבור מערכות ארגון, זהות/governance, רישוי ומגבלות harness | should_know; רביעי, או ראשון מעשי בארגון M365 | ערך מובחן למפתח .NET. ספריית client רשמית .NET/JS/Python עם תמיכה נוכחית ב־standard harness בלבד. אינו Microsoft Foundry או Agent Framework. חלופה portable: שירות בקוד. ביטחון גבוה לממשקים, בינוני להתאמת tenant |
| V06-05 | הוספת sim; platform; 06 | חסר → ״Sim״ (לשעבר Sim Studio): canvas לסוכנים+triggers+API/MCP, SDK Python/TypeScript, רישוי ליבה מול Enterprise ותפעול | should_know; חמישי כהשוואה מותנית, לא חובה לתרגל | ערך לימודי נבדל של קוד TypeScript, משאבי workspace ותזמור. FastGPT עם Stars כמעט זהים אינו פחות פופולרי; העדפת Sim נובעת מתפקידו והחיבור ל־React/TS. חלופה n8n לאוטומציות כלליות. ביטחון בינוני־גבוה |
| V06-06 | הוספת botpress; platform; 06 | חסר → ״Botpress״ בהתמקדות Cloud/Studio: מצבי שיחה, knowledge, webchat/handoff, הרחבות TypeScript, HTTP וענן | should_know; שישי/מסלול שיחה | ממחיש מוצר שיחתי וערוצים. אין לטעון ש־Cloud הוא התקנת v12 פתוחה; מאגר public devtools אינו runtime מלא של השירות. חלופה Dify לשימושי AI כלליים, Voiceflow לעיצוב/voice. ביטחון גבוה להגדרת המוצר |
| V06-07 | הוספת מדריך06 | חסר → ״מ־canvas למערכת AI שניתן לתחזק״: יסודות → Dify → Langflow → בחירת מסלול Copilot/Sim/Botpress, וקישורי המשך לרשומות הקיימות | סדר לימודי, ללא דירוג שוק | תרגול משותף אחד ואז השוואה; הפניות ל־n8n03, RAG04, vector05, MCP09 ו־evals10. אין יצירת עותקי מוצר. ביטחון גבוה |

ספירה מדויקת לחבילה V06-01–V06-07: חמש רשומות חדשות (מושג + ארבע פלטפורמות), עדכון רשומה אחת ומדריך אחד. קטגוריה06 תגדל מ־1 ל־6; הקטלוג מ־57 ל־62. revision של Dify יעלה רק בשלב יישום לאחר אימות מחדש ואישור.

## השוואת שימושיות — לפי הצורך, לא ציון איכות אוניברסלי

| צורך | בחירה ראשונה לבדיקה | חלופה ושיקול |
|---|---|---|
| אפליקציית ידע+LLM+workflow עם API | Dify | Langflow כשהרחבת רכיבים ב־Python חשובה יותר; RAGFlow כבר קיים למערכות ידע |
| לימוד רכיבים, שינויים בקוד Python וגרף RAG | Langflow | framework בקוד02 כשלא צריך canvas; אל תחשוף IDE משותף בלי בידוד |
| שילוב M365/Teams ומערכות ארגוניות של Microsoft | Copilot Studio | שירות ASP.NET/React בקוד כאשר portability, עלות או שליטה בריצה דומיננטיות |
| workflow של סוכנים, אירועים, API/MCP וקוד TypeScript | Sim | n8n הקיימת לאוטומציה כללית; Dify אם הידע ומעטפת היישום מרכזיים |
| שיחת אתר/תמיכה עם ניהול מצב והעברה לנציג | Botpress | Voiceflow אם voice ועיצוב משותף הם הצורך המוביל |
| endpoint עסקי קצר ודטרמיניסטי | קוד ASP.NET רגיל ובדיקות | builder רק כאשר העריכה החזותית/שיתוף הזרימה מצדיקים מערכת נוספת |

לכל בחירה מעשית: בנה POC אחד, נהל הרשאות משתמש בשרת, מדוד שגיאות/עלות/איכות והוכח גבולות לפני פרסום. זו שיטת לימוד מוצעת; שום POC לא הורץ במחקר.

## פופולריות ותחזוקה — מדידה נפרדת

נתוני GitHub נאספו ב־2026-11-03T08:53:23.747Z–08:53:27.858Z באמצעות REST ציבורי. זהו עניין מצטבר במאגרים עם גיל שונה, לא אימוץ פעיל או שימוש production. סדר זה כולל גם מועמדים שנדחו ואינו סדר לימוד.

| מקום לפי Stars במדגם בלבד | מאגר מייצג | Stars | Forks | latest release שנמדד | תחזוקה |
|---|---|---:|---:|---|---|
| 1 | [Dify](https://api.github.com/repos/langgenius/dify) | 160,306 | 25,350 | 1.18.0; 2026-10-23 | לא מאורכב; head2026-11-03 |
| 2 | [Langflow](https://api.github.com/repos/langflow-ai/langflow) | 156,283 | 10,315 | v1.13.0; 2026-10-22 | לא מאורכב; head2026-11-03 |
| 3 | [Flowise](https://api.github.com/repos/FlowiseAI/Flowise) | 55,547 | 25,086 | flowise@3.1.4; 2026-07-29 | מאורכב; head2026-08-13; EOL |
| 4 | [FastGPT](https://api.github.com/repos/labring/FastGPT) | 29,982 | 7,367 | v4.17.3; 2026-11-01 | לא מאורכב; head2026-11-03 |
| 5 | [Sim](https://api.github.com/repos/simstudioai/sim) | 29,980 | 3,880 | v0.9.41; 2026-11-03 | לא מאורכב; head2026-11-03 |
| 6 | [Coze Studio](https://api.github.com/repos/coze-dev/coze-studio) | 21,801 | 3,137 | v0.5.1; 2026-02-05 | לא מאורכב; head2026-07-29; אין EOL מאומת |

בקובץ הראיות נשמרו collectedAt מדויק לכל מאגר, branch, SHA, תאריך commit ומקור. latestRelease הוא endpoint latest של GitHub, לא הוכחה שכל channel/edition משתמשים באותה גרסה. commit עדכני אינו הוכחת אבטחה או תמיכה. פער של שני Stars בין FastGPT ל־Sim אינו בסיס להחלטה לימודית.

Copilot Studio, Botpress Cloud, Voiceflow ו־Google Agent Studio: **אין נתון תפוצה משותף מאומת שמאפשר לדרגם מול מאגרי הקוד**. חסר אינו נמוך או אפס. לא נמדדו Stars של SDK/מאגר Botpress היסטורי כמייצג השירות. טענות ספק על משתמשים/חברות מתוארות במחקר המשלים כהיסטוריות או שיווקיות ולא הוכחת נתח שוק. לא שונו נוסחת GitHub Interest, מדגמים או מדדי הקטלוג.

## עובדות מפתח ומקורות — מה ייכנס לפרקים אם יאושרו

| פריט/טענה | מקור ראשוני שנפתח | ערך/הקשר/גבול |
|---|---|---|
| Dify REST | [API guide](https://docs.dify.ai/en/api-reference/guides/get-started) | יישומים וידע דרך API; מפתח בצד שרת. backend Python ו־UI TS אינם SDK .NET |
| Dify רישיון | [LICENSE](https://github.com/langgenius/dify/blob/main/LICENSE) | modified Apache2; תנאים ל־multi-tenant ולמיתוג frontend. פוסט ההשקה הישן AGPL+MIT אינו רישיון נוכחי |
| Dify פריסה | [Docker](https://docs.dify.ai/en/self-host/deploy/quick-start/docker-compose) | stack מרובה שירותים; עלות תשתית/מודל ותחזוקה נפרדת מענן מנוהל |
| Dify אירוע השקה | [פוסט רשמי](https://dify.ai/blog/dify-open-source) | 2023-05-09, השקת Cloud; לא להציג כהשקת כל feature או תחילת כל הקוד |
| Langflow extension/API | [Components](https://docs.langflow.org/components-custom-components), [Quickstart](https://docs.langflow.org/get-started-quickstart) | רכיבים ב־Python ו־REST; חיבור ASP.NET דרך HttpClient הוא תכנון שלנו |
| Langflow license/security | [MIT](https://github.com/langflow-ai/langflow/blob/main/LICENSE), [Security](https://docs.langflow.org/security) | עורך capable of code execution; לא מספק tenant isolation ב־process יחיד. חובה להבחין אימות API מבידוד תשתיתי |
| Langflow אירוע תאריך | [1.0/cloud](https://www.langflow.org/blog/langflow-1-0-is-out-with-a-cloud-service/) | 2024-06-24 הוא אירוע v1.0/cloud, לא ההשקה הראשונית; leave launch unknown אם אין event label מתאים |
| Copilot Studio .NET | [Client integration](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/integrate-with-mcs) | client רשמי ל־.NET/JS/Python, standard harness בלבד לפי הדף הנוכחי; לא מנוע שלם ב־C# |
| Copilot Studio תפעול | [Overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio), [Licensing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing) | SaaS; תכונות/חיוב תלויי harness ורישיון. trial אינו הבטחת פרסום חינם; preview נפרד מ־GA |
| Copilot Studio השקה בשם זה | [הכרזה2023-11-15](https://www.microsoft.com/en-us/copilot/blog/2023/11/15/introducing-microsoft-copilot-studio-and-new-features-in-copilot-for-microsoft-365/) | אין לערבב עם היסטוריית Power Virtual Agents |
| Sim SDK/auth | [Python](https://docs.sim.ai/api-reference/python), [TS](https://docs.sim.ai/api-reference/typescript), [Authentication](https://docs.sim.ai/api-reference/authentication) | SDK רשמיים לשפות אלה; .NET ב־HTTP, SDK ייעודי לא אומת |
| Sim deployment/license | [Self-host](https://docs.sim.ai/platform/self-hosting), [Intro](https://docs.sim.ai/introduction), [License](https://github.com/simstudioai/sim/blob/main/LICENSE) | ליבת Apache2 לצד Enterprise ברישיון נפרד; flags אינם רישיון. PostgreSQL/Redis/jobs הם נטל תפעולי |
| Botpress עורך ומסלול code | [Studio](https://botpress.com/docs/studio/introduction/), [ADK](https://botpress.com/docs/adk-v2/get-started/introduction/), [API](https://botpress.com/docs/api-reference/) | Studio חזותי, ADK ב־TypeScript (גרסת ADK2.0.0) ו־HTTP; לא הובטח round-trip ביניהם. SDK C# רשמי לא אומת |
| Botpress Cloud מול v12 | [v12 policy](https://botpress.com/docs/studio/guides/advanced/v12/), [repo](https://github.com/botpress/botpress), [מחיר](https://botpress.com/pricing) | v12/self-host sunset; מוצר Cloud פעיל. MIT devtools אינו רישיון לכל הענן. חיוב לפי מסלול/שיחות ו־AI usage; אין מחיר קבוע שננעל בדוח |

בדיקות Web בוצעו ב־2026-11-03 במהלך הריצה; זמני claim-level וחלונות האיסוף מצוינים בחומרי המחקר המקושרים. משמעויות שיווקיות אינן benchmarks. לשירותי SaaS אין גרסת runtime אחידה להצמדה; לא להעתיק ADK2.0.0 כגרסת כל Botpress.

לא אומת תאריך השקה ראשונה ל־Sim, Botpress Cloud, Langflow המקורי, FastGPT או Voiceflow. לא גוזרים אותו מתאריך יצירת מאגר/copyright/הוספת הפרק. אירוע Coze להלן הוא פתיחת קוד בלבד. תאריכי מדידה שונים מתאריכי אירוע.

## דחיות, אופציות וגבולות היקף

| מזהה | מועמד/פעולה | החלטה ונימוק | מקור/ביטחון |
|---|---|---|---|
| V06-08 | Flowise | לדחות הוספה ככלי פעיל. ביסודות אפשר להזכיר EOL; פרק היסטורי enrichment רק באישור נפרד. אין successor רשמי מזוהה ואין להמציא FK ל־Langflow | [הודעת בעלים](https://github.com/FlowiseAI/Flowise/discussions/6727): freeze2026-07-29, archive08-13, EOL08-31; גבוה |
| V06-09 | Voiceflow | אופציה להוספת platform/enrichment אם רוצים מסלול voice ועיצוב שיחות, מעבר ל־Botpress; אינה חלק מהחבילה הראשית | [Docs](https://www.voiceflow.com/docs), [API](https://www.voiceflow.com/docs/api-reference/api-overview), [Billing](https://www.voiceflow.com/docs/documentation/account-management/billing); plan/add-ons/credits, private cloud תלוי Enterprise; גבוה לעובדות, בינוני לתעדוף |
| V06-10 | FastGPT | לדחות בשלב זה; enrichment אם ייבחר למסלול ידע ייעודי. חפיפה ל־Dify/RAGFlow ועלות תפעול; לא משום שאינו פופולרי | [Workflow](https://doc.fastgpt.io/en/guide/build/workflow/intro), [API](https://doc.fastgpt.io/en/openapi/intro), [LICENSE](https://github.com/labring/FastGPT/blob/main/LICENSE); תנאים נוספים, לא Apache2 נקי; בינוני־גבוה |
| V06-11 | Coze Studio | לדחות/מעקב. גרסת community נפרדת מ־Coze SaaS; head ישן יותר אינו EOL. enrichment אם יתווסף בהמשך | [README](https://github.com/coze-dev/coze-studio), [פתיחת קוד2025-07-29](https://www.byteplus.com/vi/blog/coze-open-sources-ai-agent-tools); Go/React/TS, API, Apache2; בינוני־גבוה |
| V06-12 | Google Agent Studio | הפניה במדריך לרשומת google-vertex-ai הקיימת, לא יצירת ספק כפול. הרחבת הפרק/הוספת שיוך06 תצריך בדיקת תוכנו המלא ואישור נפרד | [Design agents](https://docs.cloud.google.com/gemini-enterprise-agent-platform/agent-studio/design-agents?hl=en); Preview, יצוא Python; CX Agent Studio הוא מוצר נפרד; גבוה להגבלת ההיקף |
| V06-13 | OpenAI Agent Builder | לא להוסיף ככלי פעיל: deprecated2026-06-03, סגירה מתוכננת2026-11-30. ChatKit ממשיך ואינו אותו מוצר; Agents SDK כבר בקטלוג02 | [Deprecations](https://developers.openai.com/api/docs/deprecations#2026-06-03-agent-builder), [Migration](https://developers.openai.com/api/docs/guides/agent-builder/migrate-from-agent-builder); גבוה |
| V06-14 | n8n / LangSmith Studio / BuildShip / Opal | n8n הקיימת03 תופיע בהשוואה; Studio הוא IDE לדיבוג ולא duplicate LangGraph; BuildShip מתאים יותר03; Opal נבדק היסטורית בלבד וטעון אימות מצב נוכחי | [n8n AI](https://docs.n8n.io/advanced-ai/), [Studio](https://docs.langchain.com/langsmith/studio), [BuildShip](https://docs.buildship.com/), [Opal](https://developers.googleblog.com/en/introducing-opal/); אין המלצת הוספה לפני מחקר מלא |

FastGPT: יש סתירה בין תיעוד storage היסטורי למדריך deployment עדכני; ההמלצה נמנעת מהבטחת מבנה אחסון גורף. Dify: פוסט רישוי היסטורי שונה מ־LICENSE נוכחי; הנוכחי קובע להמלצת פריסה. Flowise: דפי docs המציגים תמיכה אינם גוברים על הודעת EOL מתוארכת. Sim: הבדלי דף self-host flags מול תנאי Enterprise אינם מבטיחים שימוש חופשי. Google: GA של CX אינו GA של visual design ב־Agent Platform.

## מדריך ותרגיל מוצעים

מדריך V06-07 יתחיל בפרק היסודות; בחרו כלי מעשי אחד. תרגיל שלא הורץ: שאלת נוהל → שליפת מקור → תשובה מובנית → בקשת פתיחת קריאה → אישור משתמש → ASP.NET endpoint מאומת. React הוא הממשק; הרשאת SQL אינה נמסרת למודל. בדקו מקור חסר, הרשאה חסרה, timeout, tool failure וקלט שמנסה לשנות הוראות. השוו באותו תרחיש עלות, עקבות, testability וניוד לוגיקה לקוד. אין כאן המלצת להחליף את ארכיטקטורת האקדמיה או להקים שירות ענן.

## ביקורת עצמאית ומגבלות

ביקורת visual_review הושלמה על חומרי המקור ועל הדוח המשולב visual06-20261103-v1. לא נמצאה התנגדות חוסמת להצגתו לאישור אנושי; זו אינה הרשאת פרסום. נקודות שהתקבלו ושולבו: הפרדת שלושת הדירוגים, Sim אינו עדיף על FastGPT לפי Stars, Langflow1.0 אינו השקה ראשונה, נתוני ענן חסרים אינם פופולריות נמוכה, ובדיקת כל הזהויות אינה audit של כל תוכן הקטלוג.

לא בוצעו התקנה/הרצה, benchmark, בדיקת הרשאות tenant בפועל, בדיקת עברית/RTL של המוצרים, בחינת חשבון/רכש או מבחן אבטחה. דוגמאות הן תכנון לימודי. גרסאות, תמחור ויכולות Preview עשויים להשתנות ויש לאמת לפני יישום. לא נבדקה מחדש תצורת LinguaReader משום שאין בחירת טכנולוגיה/תשתית לפרויקט, אלא הצעות תוכן. אין צורך בבדיקות build של האקדמיה למחקר בלבד.

חומרי עומק: [ליבה](2026-11-03-visual06-core-research.md), [ארגון](2026-11-03-visual06-enterprise-research.md), [משלים](2026-11-03-visual06-additional-research.md), [ביקורת](2026-11-03-visual06-independent-review.md).

## גבול אישור

נדרש אישור מפורש לדוח **visual06-20261103-v1**, למשל **V06-01–V06-07** לחבילה הראשית; V06-09 Voiceflow הוא אופציונלי נפרד. V06-08 ו־V06-10–V06-14 מתעדים דחייה/הפניה ואינם הוראה להוספת רשומות. אישור לא כולל עריכת פרקים מחוץ06, שינוי מדדי Interest, מיגרציות בלתי קשורות או תשתית חדשה.

לא שונו קטלוג, עדיפויות, מסד, תוכן מוצר, code runtime, מסמכי מדיניות/סטטוס או אוטומציה; לא בוצעו Commit/Push/פריסה. נכתבו **רק חומרי מחקר ב־research/**. research/proposals.json לא שונה: הוולידטור הישן אינו מייצג היטב היקף משולב של revision/פרקים/מדריך/דחייה, ו־research:check ההיסטורי אינו מוכיח כיסוי למסד החי. מזהי V06 בדוח הם הצעות pending_review; אין בהם אישור. לאחר אישור נדרשים re-read revisions ובדיקת drift לפני הכנת השינוי בפיתוח הרגיל.

## אישור ויישום — 2026-11-03
המשתמש אישר במפורש V06-01–V06-07 וביקש תיעוד היסטורי אם נתמך. החבילה יושמה במיגרציה010 לאחר preflight מלא; Dify revision3 ושישה פרקים מפורסמים ב־06. שתי רשומות נוספות Flowise/OpenAI Agent Builder נשמרו archived, ללא successor מומצא והן מוסתרות מהאתר. מדובר בהרשאה נוספת מעבר להמלצת הדחייה בדוח; V06-09 והחלופות הנדחות לא נוספו.62 מפורסמים,64 זהויות כולל היסטוריה.39 בדיקות, typecheck ו־Build עברו. תוצאות אימות האתר והמשך ב־PROJECT_STATUS.md וב־database/README.md. לא בוצעו Commit/Push/Deployment.
