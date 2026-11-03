# קטגוריה02 — ביקורת מחקר עצמאית

מזהה **remaining-review-02-20261103-v1**; תאריך2026-11-03. מבקר: remaining_coding01, שאינו מחבר דוח02. נבדקה הטיוטה agents02-20261103-v1 במלואה,13 ההצעות A02-01–13 וכיסוי12 הרשומות הקיימות (11 פעילות ו־AutoGen Legacy). בסיס86 הזהויות והרשומות: remaining-baseline-2026-11-03.json. זהו מחקר בלבד, לא אישור להחלה.

## שיטה וממצאים עצמאיים

הביקורת פתחה בעצמה מקורות רשמיים ממוקדים לטענות הסיכון: NuGet, MAF overview, Extensions.AI, Strands canonical redirect, Mastra root+EE LICENSE, OpenAI SDK, A2A SDK list+repo, ADK language list, Pydantic durability ו־AutoGen README. לא הותקנו ספריות ולא הורצו מודלים או בדיקות ביצועים. נבחן כל הקטלוג לזהויות, אך לא נפתח מחדש כל מקור היסטורי של12 הפריטים; הביקורת מתמקדת במסקנות ובטענות המשתנות החשובות.

| נושא | ממצא עצמאי | הכרעה |
|---|---|---|
| MAF A02-02 | NuGet מציגה Microsoft.Agents.AI1.27.0 ללא suffix prerelease; overview מגדיר Go Public Preview ומונה יכולות חסרות | נכון לתקן ניסוח .NET prerelease גורף; לא לטעון GA לכל חבילה/שפה. [NuGet](https://www.nuget.org/packages/Microsoft.Agents.AI), [Overview](https://learn.microsoft.com/en-us/agent-framework/overview/) |
| Extensions.AI A02-03 | רשימה רשמית IChatClient/IEmbeddingGenerator ובנפרד IImageGenerator Experimental | SDK C# מובחן מ־framework ומהספרייה Evaluation הקיימת10; לא לסמן כל ממשק יציב. [Libraries](https://learn.microsoft.com/en-us/dotnet/ai/microsoft-extensions-ai) |
| OpenAI A02-06 | דף SDK הרשמי מפנה ל־Python/TypeScript ומטיל tools/storage/deployment/approval על היישום | SDK .NET של API אינו Agents SDK C#; SDK מול managed API הוא הבדל אחריות אמיתי. [Official guide](https://developers.openai.com/api/docs/guides/agents/sdk) |
| Pydantic A02-07 | התיעוד מגדיר שמונה מנועי durability ותלות ברכיב, ומגביל engine אחד לכל agent | הסבר נכון; checkpoint/persistence אינו זהה להבטחת תהליך durable או exactly-once SQL. [Durability](https://pydantic.dev/docs/ai/capabilities/durable_execution/overview/) |
| Mastra A02-09 | rootLICENSE מפנה ee לרישיון נפרד; eeLICENSE דורש ProductionUse בהסכם מפורש וגם key תקף | הוספתי דרישה לקישור EE ישיר. החוקר הוסיף ואימת; אין לתאר Apache2 גורף. [Root](https://github.com/mastra-ai/mastra/blob/main/LICENSE.md), [EE](https://github.com/mastra-ai/mastra/blob/main/ee/LICENSE) |
| Strands A02-10 | sdk-python מפנה ל־harness-sdk ובו Python/TS SDKs לצד harness/CLI/כלים | ה־alias אינו מוצר נוסף. Stars שלmonorepo אינם מדד נפרד לכל SDK; Bedrock default אינו חובת AWS. [Canonical redirect](https://github.com/strands-agents/sdk-python) |
| Deep Agents A02-11 | Profiles page שנפתח הוא Python, אך אין בו הכרזה מפורשת שכל Profiles Python-only | דרשתי ניסוח ״Python נבדק; parity ל־TS לא אומת״ במקום קביעה גורפת. החוקר אישר תיקון. Managed service BETA נפרד מ־SDK. [Profiles](https://docs.langchain.com/oss/python/deepagents/profiles) |
| A2A A02-12 | האתר הרשמי מפנה ל־.NET SDK ו־a2a-dotnet כולל server/client C# | הוספת protocol מוצדקת; אין SDK parity/GA גורף ואין החלפה של MCP. [SDK list](https://a2a-protocol.org/latest/sdk/), [Repo](https://github.com/a2aproject/a2a-dotnet) |
| ADK no-change | הרשימה הרשמית מכילה Python/JS/Go/Java/Kotlin, ללא C# ברשימה שנפתחה | no-change סביר לבסיס; אין להסיק שכל גרסה תומכת בכל יכולת. [ADK](https://adk.dev/) |
| AutoGen historical | בראש README הודעת archived/no securityfixes; בהמשך נשאר טקסט maintenance-mode | ההודעה הראשית גוברת; לא להחזיר לפעיל ולא להמציא יום ארכוב. המצב הקיים Legacy נשמר. [README](https://raw.githubusercontent.com/microsoft/autogen/main/README.md) |

## סקירת כל13 ההצעות וסדר הלמידה

A02-01–03: פרק יסוד, SDK abstractions קטן ו־MAF יוצרים מסלול C# עקבי. נכון להתחיל בסוכן ידני ו־tool אחד כדי להבין הרשאה, cancellation ותקרת צעדים. אין חובה ב־multi-agent או harness מיד.

A02-04–09: הרחבות שבע הרשומות אינן שש דרישות קדם חדשות. שמירת חשיבות LangGraph כחובה פירושה הבנת state/edges/checkpoint, לא הכרח ליישם גםPython וגם.NET. LangChain, OpenAI SDK ו־Pydantic חלופות בחירת stack; CrewAI העשרה; Mastra מסלולTS עם רישוי מהדורות. תרגילי ההשוואה צריכים להשתמש באותה משימה ובאותם מקרי כשל, כפי שהדוח מציע.

A02-10–12: Strands/Deep Agents הם מסלולי harness/loop עם חפיפה אמיתית, ולכן enrichment ראוי. A2A מוסיף גבול agent-to-agent חוצהשירותים; צרכן באותו process יכול להסתפק בפונקציה אוREST. .NET רשמי של A2A מצדיק ערך לקהל, בלי לחייב פרוטוקול חדש לכל יישום.

A02-13: מדריך מוצדק. Temporal קיימת02+03; בעלות התיקון ב־03 מונעת שני patches סותרים לאותה revision. MCP SDK09, Evaluation10 ו־Extensions.AI אינם אותה ספרייה; נדרשים קישורים ולא פרסום כפול.

נבדקו סוגים ו־slugs מול86 הזהויות: חמש התוספות אינן קיימות. שבע ההרחבות מצביעות לרשומות קיימות עם revisions נכונים; no-change ל־Agno/ADK/smolagents ו־AutoGen אינו מחייב שינוי מסמך. העובדה שלא הוצע עדכון לכל אחת אינה פער כיסוי כשהמצב מוסבר.

## השלמה לפופולריות

הביקורת גילתה ופתחה [Stack Overflow2026 — orchestration](https://survey.stackoverflow.co/2026/ai/data/ai-orch): Used, n=4,400, שאלה על שימוש בשנה האחרונה ורצון לששתהחודשיםהבאים, בחירהמרובה. LangChain30.2%, OpenAI SDK23.8%, LangGraph18.8%, ADK14%, Pydantic8.9%, CrewAI5.5%, Strands4%, Mastra3%, smolagents2.6%, Agno2.4%. אלה משיבי אותה שאלה ולא כלל המפתחים או market share; ODbL1.0, Stack Exchange Inc. נתוניAutoGen/SK אינם הוכחת תמיכה פעילה. אין לייחס framework survey לזהות ענן או תוסף שונה.

ביקשתי מהחוקר להחליף ״סקר לא אומת״ בפסקה מוגדרת עם המכנה והמגבלות. אין בכך בקשה לשנות טבלת מדדים או UI; מיפוי לפרסום עתידי נדרש לאישור בנפרד. איסוף GitHub המרכזי נכשל403; אין רענון timestamps או מספריHTML מעוגלים. נשמרים snapshots בסיס עם זמנם, ונתון חסר אינו0.

## מגבלות ומסקנה

אין benchmark, Hebrew-quality eval, התקנות או ניסוי recovery. גרסאות package הן תצפיות מתוארכות ואינן הבטחת אבטחה. מקור רשמי אחד תומך בעובדה צרה; בדיקת מקור בידי סוכן נפרד אינה הופכת שני מסמכי ספק לשתי הוכחות efficacy.

**אין חסימה להצגת13 ההצעות למשתמש לאחר שני התיקונים שהחוקר אישר**: Mastra EE source ו־Profiles language qualification. מומלץ גם לשלב ממצא survey כדי להשלים את בקשת הפופולריות. ליבה A02-01–04 ו־A02-13; יתר תיקוני העובדות מומלצים לשמירת דיוק, ותוספות harness/A2A לבחירה. הביקורת אינה אישור משתמש לפרסום. לא השתנו קטלוג, קוד, SQL, מדדים, סודות או מסמכי מדיניות.
