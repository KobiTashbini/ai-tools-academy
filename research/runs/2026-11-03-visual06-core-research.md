# מחקר ממוקד: Dify, Langflow ו־Flowise — קטגוריה 06

מזהה חומר מחקר: visual06-core-20261103-v1. סטטוס: הצעות בלבד, ללא אישור וללא שינוי קטלוג. סוכן מחקר: visual_core. checkedAt אחיד לעובדות שנצפו ברשת: 2026-11-03T08:54:30Z (חלון האיסוף 08:52–08:54 UTC). המקורות נפתחו במלואם ככל שהתאפשר; אין כאן הסתמכות על snippets בלבד. מדידות GitHub נאספו במרוכז בידי הסוכן הראשי; הקובץ visual06-github-retry-2026-11-03.json קובע את זמן כל מדידה.

## בסיס וכיסוי

בסיס חי: research/evidence/visual06-baseline-2026-11-03.json, checkedAt=2026-11-03T08:52:38.037Z. נבדקו 57 זהויות בכל סטטוס לפי השאילתה; בתחום 06 רשומה אחת בלבד: dify, revision=2, published, platform, should_know. אין Flowise או Langflow, כולל בדיקת שמות ומאגרים. שתי אלה אינן כינויים של Dify. n8n כבר נמצא בקטלוג, לכן אינו תוספת חדשה למחקר זה. לא זוהו הצעות ממתינות בבסיס. הרשומה הקיימת נבדקה 1/1 ומוצע להרחיבה ולא להחליפה.

חיפושי הגילוי כללו בעיות של בניית תהליכי AI חזותיים, רכיבי Python מותאמים, REST ו־SDK, self-hosting, רישוי, חדשות השקה ותחזוקה. היקף צוות זה הוא שלושה מוצרים; אין לייחס לו כיסוי לכל שוק ה־builders. הסוכן הראשי חוקר מועמדים נוספים.

## המלצות נקודתיות

| פעולה | פריט וסיווג | לפני → אחרי מוצע | חשיבות והנמקה | ביטחון |
|---|---|---|---|---|
| תיקון והרחבה | Dify; platform; slug קיים dify | revision2: פרק בסיסי עם מקור יחיד → הרחבת גרסה3: Agent החדש לצד Workflows/Chatflows, רישוי ופריסה, REST וגבולות אבטחה; תאריך Cloud מאומת | should_know נשארת. שימושית מאוד לאבטיפוס AI ארגוני הכולל ידע, תהליך ו־API; אין סיבה להעלות ל־must_learn רק בגלל Stars | גבוה להגדרת המוצר והרישוי; אין ניסוי מעשי |
| הוספה | Langflow; platform; slug מוצע langflow | חסרה → פרק Python components + visual graph + HTTP API, רישוי MIT וגבולות בידוד | should_know. ערך נבדל מהעטיפה המוצרית של Dify: הבנת רכיבים ויציאה לקוד Python; מתאים למפתח שרוצה לראות ולהרחיב את המערכת | גבוה; C# רק HTTP מאומת |
| דחייה ככלי פעיל | Flowise; platform אם יתווסף | חסרה → לא להוסיף לרשימת כלים פעילים. לכל היותר פרק היסטורי enrichment באישור נפרד | EOL הופך אותה לבחירה חלשה לפרויקט חדש אף שיש עניין GitHub גבוה. ערך לימודי אפשרי: מיגרציה מכלי שנסגר, לא תרגיל ראשון | גבוה מאוד: הודעת בעלים וארכוב מאגר תואמים |

מזהי הצעות סופיים יוקצו בידי הסוכן הראשי כדי למנוע התנגשות. אין צורך במחיקה או מיזוג. אין successor רשמי מזוהה ל־Flowise; אין להציג Langflow כמחליפה רשמית. מאחר שמבנה entry_lifecycle הקיים מחייב successor, אין להוסיף סימון מכני שחייב להמציא מחליפה. אפשר לדחות או לכתוב הערת EOL מפורשת בדוח/פרק עתידי.

## Dify — עובדות מאומתות והצעת תוכן

- זהות: LangGenius / langgenius/dify; פלטפורמת יישומים ותהליכי AI עם Workflows, ידע וסוכנים; אינה מודל או SDK יחיד. [מאגר רשמי](https://github.com/langgenius/dify). הגדרה תואמת את הרשומה הקיימת.
- גרסה שנצפתה ב־latest: 1.18.0 מ־2026-10-23, עם Agent routing, חבילות אפליקציה ניידות ועקבות תהליכים מקוננים. Release מסביר צורך לשדרג יחד API/workers/Agent backend/runtime ומציין Python3.13 להתקנת source. [Release1.18.0](https://github.com/langgenius/dify/releases/tag/1.18.0). זהו אירוע גרסה, לא תאריך השקה ראשונה.
- שפות ליבה: backend Python לפי pyproject, UI React/Next.js לפי package.json; אין להסיק מכך SDK משולב לכל שפה. [API manifest](https://github.com/langgenius/dify/blob/main/api/pyproject.toml), [Web manifest](https://github.com/langgenius/dify/blob/main/web/package.json).
- כל יישום מפורסם חשוף גם כ־REST API, עם מפתח יישום בצד השרת. קריאה משירות ASP.NET דרך HttpClient היא תכנון אינטגרציה סביר שלנו, לא SDK רשמי ל־.NET. [תיעוד API](https://docs.dify.ai/en/api-reference/guides/get-started). מדריך SDK במאגר מציין Java/Go/Ruby ומציג TODO למיקומי Python/PHP/Node; אין להשתמש בו כהבטחת parity או SDK .NET. [SDK index](https://github.com/langgenius/dify/tree/main/sdks).
- בתוך Code node אפשר Python או JavaScript; פעולה זו נפרדת מליבת הפלטפורמה ומ־HTTP integration. התיעוד מתאר sandbox והגבלות filesystem/network; אין לפרש כערבות אבטחה לכל התוספים והפריסה. [Code node](https://docs.dify.ai/en/cloud/use-dify/nodes/code).
- Self-hosting דורש תפעול של מספר שירותים, לא container זעיר אחד. התיעוד הנוכחי מפרט שבעה core services ושמונה תלויות, עם דרישות מינימום2 ליבות/4GiB והערות Windows/WSL2. מספר השירותים תלוי גרסה. [Docker Compose](https://docs.dify.ai/en/self-host/deploy/quick-start/docker-compose). זו עלות מורכבות שיש לשקול מול managed cloud; אין הצעת שינוי תשתית לאקדמיה.
- רישוי נוכחי: Dify Open Source License מבוסס Apache2 עם תנאים נוספים עבור multi-tenant service ושינוי/הסרת logo/copyright ב־frontend; לא לכתוב Apache2 ללא הסתייגות. [LICENSE נוכחי](https://github.com/langgenius/dify/blob/main/LICENSE). תיאור השקה2023 המציין AGPL+MIT הוא היסטורי ואינו גובר על LICENSE הנוכחי. אין כאן פרשנות משפטית מלאה.
- השקה: 2023-05-09 מדויק כהשקת גרסת הענן, לפי פוסט מתוארך2023-05-15. אפשר להוסיף release עם note שמדובר בענן ולא בתאריך תחילת כל הקוד; לחלופין2023 בלבד אם השדה מוצג כיציאה ציבורית כללית. [הודעת הפתיחה לקוד](https://dify.ai/blog/dify-open-source). לא להשתמש ב־2024-04-08 של השקת Workflow כתאריך השקת Dify.
- אבטיפוס מוצע שלא הורץ: React → ASP.NET endpoint עם הרשאת משתמש → Dify Workflow לשליפת נוהל → תשובה עם מקור והסלמה לאדם. להשאיר הרשאות עסקיות ופעולות SQL בממשק שרת בדוק; API key של Dify לא בדפדפן. שימושיות זו המלצה הנדסית, לא benchmark.

## Langflow — עובדות מאומתות והצעת תוכן

- זהות: langflow-ai/langflow; visual builder ליישומי AI, agents ו־RAG; אינו LangGraph ואינו מוצר LangChain רק בגלל השם. [מאגר](https://github.com/langflow-ai/langflow). סיווג platform מתאים לסכימה המקומית; ההסבר יכול לציין שהספק קורא לו visual framework.
- גרסה latest שנצפתה: v1.13.0 מ־2026-10-22. [Release](https://github.com/langflow-ai/langflow/releases/tag/v1.13.0). התיעוד מסומן1.13.x. אין ארכוב במאגר ואין כאן הכרזה שהמוצר נטול תקלות.
- מודל ההרחבה: node הוא component, קוד Python היורש Component עם inputs/outputs וממשק גרפי. מסלול import lfx החליף langflow.custom ב־1.7 עם תאימות לאחור המתוארת בתיעוד. [Custom components](https://docs.langflow.org/components-custom-components). זהו הבדל לימודי ממשי מול visual builder שמשאיר פחות קוד נגיש.
- HTTP: quickstart מלמד פרסום flow והפעלה ב־run endpoint עם API key. [Quickstart](https://docs.langflow.org/get-started-quickstart), [OpenAPI1.13.0](https://docs.langflow.org/api). ASP.NET יכול לצרוך REST; לא אותר SDK C# רשמי ולא אומתה parity שלו. Python הוא מסלול הרכיבים וה־runtime; TypeScript של ה־frontend אינו ראיה לכך שהרכיבים נכתבים TypeScript.
- Self-hosting: containerized app אורז flows ותלויות, וקיימים מסלולי Docker/remote server/Kubernetes. [Deployment](https://docs.langflow.org/deployment-overview). הבחירה אינה מחייבת Kubernetes לניסוי לימודי.
- נקודת גבול מהותית: הספק מתאר UI כ־IDE המסוגל להריץ Python עם גישה לתהליך, דיסק ורשת; אין בידוד משתמשים/tenants בתוך process יחיד. תיעוד ממליץ בידוד תשתיתי ו־gateway חיצוני. [Security1.13.x](https://docs.langflow.org/security). חסימת custom components היא אפשרות הגדרה, לא תחליף לכל מדיניות אבטחה. [Block custom components](https://docs.langflow.org/deployment-block-custom-components). יש להימנע מהמלצה על חשיפת עורך ציבורי משותף.
- רישוי: MIT לפי קובץ רישיון המוצר. [LICENSE](https://github.com/langflow-ai/langflow/blob/main/LICENSE). רישיון המוצר אינו רישיון לכל מודל/שירות חיצוני.
- אירוע תאריך מאומת:1.0 והכרזת cloud service ב־2024-06-24. [פוסט1.0](https://www.langflow.org/blog/langflow-1-0-is-out-with-a-cloud-service/). המוצר קדם ל־1.0 ולכן לא להציג יום זה כתחילת הפרויקט; תאריך השקה ראשונה לא אומת. אין טעם למלא תאריך שגוי בשביל מיון.
- אבטיפוס מוצע שלא הורץ: מסמך קטן → chunking/retrieval → prompt → JSON validation → API; להוסיף component Python יחיד ורק אז להשוות לשירות בקוד. prerequisites: HTTP/JSON, Python בסיסי ו־RAG. היתרון למפתח .NET הוא הבנת שירות מרוחק ופיתוח אינטגרציה, לא תכנות .NET בתוך העורך.

## Flowise — הכרעת תחזוקה והסתירה לתיעוד

המקור המכריע הוא [הודעת הבעלים The Future of Flowise](https://github.com/FlowiseAI/Flowise/discussions/6727), שפורסמה ב־2026-08-13. היא מגדירה code freeze ב־2026-07-29, ארכוב ב־2026-08-13 ו־EOL ב־2026-08-31. [המאגר](https://github.com/FlowiseAI/Flowise) מציג Public archive ומפנה לאותה הודעה. אלה שתי תצפיות תואמות מאותו בעלים, לא אימות ארגוני בלתי תלוי.

[דף התיעוד](https://docs.flowiseai.com/) עדיין מציג יכולות Assistant/Chatflow/Agentflow ואף community/vendor support. יש להתייחס אליו כתיאור יכולות היסטורי; הוא אינו מבטל EOL המתוארך. [Prediction API](https://docs.flowiseai.com/using-flowise/prediction) מתעד SDK Python/TypeScript ו־REST, לא SDK C#; אלה נכסים היסטוריים ואין להציגם כהבטחת תמיכה עתידית. [LICENSE](https://github.com/FlowiseAI/Flowise/blob/main/LICENSE.md) מבחין בין Apache2 לחלקי enterprise מסחריים; גם ההודעה המקצרת ל־Apache2 אינה מצדיקה תיוג כל המאגר כטהור Apache2.

תאריך השקה ראשונה לא אומת. אין לחלץ אותו משנת copyright או מתאריך יצירת המאגר. לא אומתה חלופה קהילתית שירשה רשמית את הפרויקט. מסקנה פדגוגית: לא להתחיל איתו פרויקט חדש או לתת לו should_know כאילו הוא פעיל. אפשר לשלב פסקה ביסודות על סיכון EOL לצד Stars גבוה, ללא רשומה עצמאית בשלב זה.

## השוואת החלטות למפתח

| צורך | בחירה מועדפת במחקר זה | חלופה ושיקול |
|---|---|---|
| יישום AI שלם עם תהליך, ידע ו־API | Dify | Langflow אם הרחבת Python חשובה יותר ממעטפת יישום; שירות קוד קטן אם הלוגיקה העסקית דומיננטית |
| להבין גרף רכיבים ולהרחיב בקוד Python | Langflow | Dify כשרוצים חיבורי מוצר/ידע ופחות מימוש רכיב; Framework קיים ב־02 אם לא צריכים עורך חזותי |
| שימוש חוזר במערכת Flowise קיימת | תכנון תחזוקה/מעבר, לא אימוץ אוטומטי | להעריך ניוד flow ושירותי API; אין טענת converter אוטומטי או compatibility |
| לוגיקה עסקית דטרמיניסטית קצרה ב־.NET | endpoint רגיל ובדיקות עשויים להספיק | builder מוסיף ערך כשנראות ויכולת עריכה של זרימת AI מצדיקות runtime נוסף |

סדר לימודי מוצע: יסודות graph/state/schema/error handling/API keys/evals → Dify כיישום שלם → Langflow כהשוואה לקוד → חלופות ענן/ארגון שמחקר הסוכן הראשי יוסיף. אין צורך ללמוד כל כלי לעומק. שני הכלים הפעילים should_know; יסודות concept יכולים להיות must_learn. חשיבות זו המלצה שלנו, נפרדת ממדידת Stars.

## מגבלות

לא בוצעו התקנה, הרצה, בדיקות עומס, feature parity, בדיקת עברית/RTL במוצרים, בחינת חשבון ענן או תמחור חוזי. לא אומתו SDK .NET רשמיים ל־Dify/Langflow/Flowise ואין להמציא שלילה גורפת לקיומם. אין מדדי משתמשים/נתח שוק מאומתים ולכן פופולריות במחקר המרכזי תוגבל ל־Stars לכל מאגר, עם זמן איסוף ו־archived flag. מחקר זה אינו ביקורת עצמאית של הדוח הכולל; ביקורת כזו מיועדת לסוכן נפרד.
