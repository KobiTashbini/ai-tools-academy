# קטגוריות09/10 — ביקורת מחקר עצמאית

מזהה: **integrations0910-review-20261103-v1**. מבקר: `integrations0910_review`, נפרד משני חוקרי הקטגוריות. תאריך2026-11-03. סטטוס מחקר בלבד; אין אישור פרסום. בסיס: `research/evidence/integrations0910-baseline-2026-11-03.json`, נאסף2026-11-03T10:05:50.141Z;71 זהויות בכל סטטוס, שתי רשומות בהיקף: MCP ו־Langfuse, revision2 ו־must_learn. מדריכי09/10 חסרים בבסיס. נבדקו הזהויות למניעת רשומות כפולות; המסגרות02 והספקים07 אינם תחליף לזהות מוצר נפרדת.

## שיטת ביקורת

נפתחו באופן עצמאי מסמכי מפרט, רשימות גרסאות, LICENSE, דפי SDK, NuGet ומטריצות תאימות רשמיות. הראיות הממוקדות: [ממצאי הביקורת](../evidence/integrations0910-review-sources-2026-11-03.json). מקור מאותו ספק אינו אימות צד שלישי; יתרון המהלך הוא בדיקה עצמאית של הטענה והיקפה. לא בוצעו התקנות, קריאות מודל, red teaming, benchmark או כתיבה לקטלוג. צילום GitHub מרוכז של הסוכן הראשי נפרד מביקורת התוכן.

## תיקונים ומגבלות שנדרשו במהלך המחקר

| נושא | התנגדות / ממצא עצמאי | הכרעה מומלצת |
|---|---|---|
| MCP specification | מפרט2026-07-28 מתאר metadata לכל בקשה, stdio/Streamable HTTP ומשטר stateless; initialize/session שייכים למסלולי תאימות ישנים. | להצמיד הסבר לגרסה ולא ללמד lifecycle ישן כאוניברסלי. [Transports](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports) |
| MCP authorization | OAuth אינו חובה לכל מימוש; הדרישות תלויות HTTP לעומת stdio. | להפריד אימות/הרשאה עסקית, ספק זהות, גבול תהליך ונתיבי HTTP; הרשאת כלי נבדקת ביישום. [Authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization) |
| MCP C# freshness | דף Releases בעת הביקורת מציג v2.3.1 כ־Latest03/11, תיקון security של authenticated stateful sessions; v2.3.0 אינו Latest. | מקור גרסאות עדכני גובר על cache של עמוד/תוצאת חיפוש. לא להסיק זמינות NuGet מכל תג. [Releases](https://github.com/modelcontextprotocol/csharp-sdk/releases) |
| MCP רישוי | README שמצהיר Apache2 אינו מתאר לבדו את מעבר הרישוי. LICENSE מבחין תרומות חדשות Apache2, תרומות ישנות שלא הוסכמו נשארות MIT ותיעוד שאינו מפרט CC-BY4. | לציין transition/חריגים ולא MIT או Apache2 אחיד לכל ההיסטוריה. [C# LICENSE](https://github.com/modelcontextprotocol/csharp-sdk/blob/main/LICENSE), [Inspector LICENSE](https://github.com/modelcontextprotocol/inspector/blob/main/LICENSE) |
| Inspector | כלי בדיקה דטרמיניסטי לשרתי MCP; אינו host כללי לפעילות עסקית ואינו sandbox בטוח לכל שרת. | should_know לאחר שרת ראשון; בדיקות protocol נפרדות מבדיקת הרשאות ועומס. [Repository](https://github.com/modelcontextprotocol/inspector) |
| Langfuse .NET | SDKs רשמיים Python/JS/TS; לשפות אחרות OTel/API. endpoint OTel הנוכחי HTTP, לא gRPC. | לתעד מסלול .NET מפורש בלי להבטיח SDK Langfuse מקומי או parity בפיצ'רים. [SDKs](https://langfuse.com/docs/observability/sdk/overview), [OTel](https://langfuse.com/integrations/native/opentelemetry) |
| Langfuse lifecycle |16/11/2026 הוא מועד cutover מתוכנן לנתיבים ישנים בענן; הוא עתידי ביחס למחקר, scores חריגים, self-hosted תלוי גרסה. | אין להציג את Langfuse כ־Legacy/Discontinued; יש לעדכן שילוב לגרסה ולממשק. [Compatibility](https://langfuse.com/docs/compatibility) |
| Langfuse license/privacy | core MIT אינו מבטיח EE server-side masking, retention policies או audit logs. | redaction לפני export; אימות מהדורה ורישיון לפני הבטחת ממשל/פרטיות. [EE features](https://langfuse.com/self-hosting/license-key) |
| Phoenix license | LICENSE מציין ELv2 והגבלה על הצעת שירות מנוהל לצדדים שלישיים. | לא לתאר Apache/MIT או היתר מסחרי גורף בגלל תווית OSS שיווקית. [LICENSE](https://github.com/Arize-ai/phoenix/blob/main/LICENSE) |
| Microsoft evaluation | NLP דטרמיניסטי, Quality משתמש ב־LLM judge, Safety נעזר בשירות Foundry; RTC evaluator מסומן Experimental. | יתרון .NET מובהק, אך אין הבטחת offline/ללא Azure לכל החבילות או GA לכל תכונה. [Libraries](https://learn.microsoft.com/en-us/dotnet/ai/evaluation/libraries), [NuGet](https://www.nuget.org/packages/Microsoft.Extensions.AI.Evaluation) |
| LangSmith deployment | self-host/BYOC זמינים ב־Enterprise; רישיון SDK אינו רישיון כל הפלטפורמה. | להשוות backend לפי נתונים, תפעול ומהדורה; אין חובה ללמידה עמוקה נוספת אחרי backend אחד. [Hosting](https://docs.langchain.com/langsmith/platform-setup) |
| NeMo Guardrails | קוד Apache2 אינו רישיון מודל/NIM; classifier או flow אינם הוכחת אבטחה. | שכבת policy משולבת בהרשאות דטרמיניסטיות, לא תחליף להן. [LICENSE](https://github.com/NVIDIA-NeMo/Guardrails/blob/develop/LICENSE.md) |
| OTel GenAI | דף semconv/gen-ai הועבר למאגר נפרד. אין להסיק מהעברה שהמוצר ננטש או שכל conventions יציבות. | להפריד tracing API יציב מתוויות GenAI תלויות גרסה. [Moved notice](https://opentelemetry.io/docs/specs/semconv/gen-ai/) |
| Promptfoo privacy | CLI מקומי עדיין שולח telemetry שימוש כברירת מחדל, ולספקים/מעריכים עשויים להיות מסלולי נתונים משלהם. | אין להבטיח no-network. תיעוד telemetry טוען שאינו כולל prompts/outputs; זו טענה מוגדרת, לא הוכחת כל תעבורת המוצר. [Telemetry](https://www.promptfoo.dev/docs/configuration/telemetry/) |

## שיקולים פדגוגיים עצמאיים

09: ידע Tool Calling, חוזה OpenAPI והרשאה חשובים לפני SDK. שרת MCP קטן ב־C# מעל שירות מלאי קיים הוא תרגיל יסוד מובחן; Inspector בודק את החוזה אחרי ההקמה. FastMCP הוא חלופה בשפת Python, לא שלב שחובה להתקין בנוסף ל־C#. GitHub ו־Playwright מדגימים סוגי אינטגרציה שונים; אין להמליץ עליהם כתחליף להרשאה ולבידוד. Composio מועמד העשרה: ריבוי connectors ו־OAuth מנוהל אינו צורך בסיסי של כל לומד. אין צורך להעתיק לקוחות שכבר מופיעים01/02 כרשומות כפולות.

10: תחילה יסודות trace/eval/threat model עם redaction, הרשאות ותכנון נתונים; אחר כך OTel ב־.NET ובחירת backend אחד. יש לבחור eval runner אחד לתרגיל ראשון, ורק בהמשך כלי RAG-specific. NeMo או כלי policy נוספים מוצדקים כאשר יש דרישה קונקרטית, בלי לדחות אבטחה לסוף המסלול. שלוש פלטפורמות תצפיתיות אינן שלוש דרישות קדם. הורדת חשיבות מוצר must_learn→should_know יכולה להיות מוצדקת רק כשמובהר שהיכולת עצמה נשארת יסוד חובה, ולא משום ש־Stars נמוכים יותר.

הדוגמאות צריכות להציע אותו תרחיש עסקי: בירור מלאי/רכש דרך .NET, זיהוי שגיאת retrieval מול שגיאת tool, בדיקות schema ותוצאה עסקית, והסתרת מידע לפני trace. LLM judge דורש כיול וביקורת אנושית; ציון יחיד אינו נכונות, test pass אינו הוכחת בטיחות, ותוצאות בעברית דורשות ניסוי שלא בוצע כאן.

## מגבלות גישה

ניסיונות פתיחת דפי Promptfoo בנתיבים privacy, red-team/privacy ו־red-team/troubleshooting נכשלו. לא מבוססת עליהם המלצה. דף telemetry הרשמי נפתח והספיק לטענה הצרה. לא נעשה שימוש במספרי Stars מעוגלים מה־HTML כצילום מדידה מדויק. אין מסקנת הפסקה מגיל commit או היעדר גישה.

## סקירת הטיוטות

הבדיקה הסופית של שני דוחות החוקרים מופיעה בהמשך. הממצאים נשלחו לחוקרים ולסוכן הראשי ושולבו בטיוטות; אין לראות במסמך זה אישור משתמש להחלה.

## סקירת הדוחות המלאים — הושלמה

נקראו שתי הטיוטות במלואן: `integrations09-20261103-v1`, T09-01–T09-09, ו־`quality10-20261103-v1`, Q10-01–Q10-10. ההערכה להלן היא המלצת ביקורת על הצעות, לא אישור המשתמש להחלה.

| הצעות | תוצאת ביקורת מהותית |
|---|---|
| T09-01–02 | הרחבת הפרוטוקול ופרק החוזים משלימים זה את זה: protocol לעומת הרשאה עסקית/idempotency. שניהם must_learn מוצדקים כידע תשתיתי. אין כפילות עם פרקי הספקים משום שהתרגיל חוצה ספק. |
| T09-03–04 | C# SDK ו־Inspector הם ספרייה וכלי פיתוח מובחנים. should_know מוצדק; סדר SDK→Inspector→כשלי auth מספק תוצר לימודי ולא רשימת התקנות. הערת NuGet הלא מאומת נדרשת ומופיעה. |
| T09-05 | FastMCP מוסיפה חלופת Python וגשר OpenAPI; אין להציג אותה כשלב חובה נוסף במסלול.NET. הדוח מציב אותה כהסתעפות ומבחין מהגרסה הכלולה ב־Python SDK. |
| T09-06–07 | GitHub ו־Playwright נותנים שני workflows שונים, API-tools לעומת UI; שומרים חלופה פשוטה REST/CLI ובדיקות Playwright דטרמיניסטיות. דוגמאות read-only/isolated מקטינות צורך הרשאות למעבדת התחלה, בלי להבטיח sandbox. |
| T09-08–09 | Composio enrichment מוצדק עקב OAuth/connectors מנוהלים אך תלות SaaS. המדריך מקדים חוזה והרשאה לכל connector ולא מחייב תרגול כל מוצר. אין התנגדות מהותית להצעות אלה. |
| Q10-01–03 | יסודות חובה, תיקון Langfuse ו־OTel.NET הם גרעין ברור. הורדת חשיבות Langfuse ל־should_know סבירה כהמלצה נפרדת כי הידע עבר לפרק יסודות, ואפשר לדחותה בלי לדחות תיקון עובדתי. SDK מול backend נשמרים כשכבות משלימות. |
| Q10-04–06 | Microsoft Evaluation כנתיב C# ראשון, Promptfoo כ־HTTP/CI ו־Ragas לניתוח retrieval מכסים תפקידים שונים עם חפיפה מוצהרת; אין חובה ללמוד שלושתם. הוראות calibration ועלות judge והיעדר ניסוי בפועל מונעות המלצה המבוססת score בלבד. |
| Q10-07–09 | LangSmith היא חלופת פלטפורמה should_know; Phoenix הועברה ל־enrichment במהלך הביקורת בגלל חפיפה ורישוי; NeMo enrichment מוצדקת רק ל־runtime policy. שלושתן אופציונליות למסלול הליבה, ותיאור מגבלות .NET/תפעול נאות. |
| Q10-10 | הסדר מציב dataset, threat model, הרשאות ו־redaction מההתחלה; tracing אינו תנאי לאישור פעולה ו־guardrails אינם תיקון מאוחר להיעדר הרשאות. סדר הלמידה שימושי למפתח.NET וכולל חלופות פשוטות. |

בכל שורת תוספת יש סוג קיים, slug מוצע, רמת חשיבות, מקור ונימוק/חלופה. הדוחות כוללים דוגמאות שלא הורצו, יתרונות וחסרונות ולא מציגים first-launch date שלא אומת. נבדק מול71 הזהויות שאין זהות מוצעת שכבר קיימת. cross-category references לפרקי02/04/07/08 אינם פרסום כפול. `product` משמש לשרתי MCP בהיעדר סוג server בסכמה; זהו שימוש עקבי בסוג קיים עם תפקיד מפורש בפרוזה. אין שינוי טקסונומיה מוצע.

### הסתירה הנוספת ב־OWASP

אומת באופן עצמאי שהרפו הישן תחת OWASP מפנה לרפו `GenAI-Security-Project/GenAI-LLM-Top10`, ושמהדורת2026 פורסמה לפי שני עמודי מקור רשמיים. עם זאת, יום הפרסום אינו אחיד: README של הרפו הישן והחדש מציין04/08/2026; דף הפרסום באתר מציג03/08/2026. דף ה־landing הכללי `llm-top-10` עדיין מציג2025. המלצה מחייבת לבהירות: בדוח לציין את הפער, ובתוכן עתידי להשתמש ״מהדורת2026״ בלי יום פרסום מוסכם. אין צורך לדחות את פרק היסודות בשל הפער ביום; אין להשתמש בתאריך זה כשנת השקת כלי.

מקורות שנפתחו: [OWASP repository transition](https://github.com/OWASP/www-project-top-10-for-large-language-model-applications), [Current source2026](https://github.com/GenAI-Security-Project/GenAI-LLM-Top10), [OWASP publication2026](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/), [Landing still2025](https://genai.owasp.org/llm-top-10/).

### מסקנת ביקורת

הדוחות מתאימים להצגה למשתמש כהצעות מפורטות. חוקר10 אישר שהערת OWASP שולבה, וכן Phoenix כ־enrichment ו־Promptfoo telemetry כברירת מחדל. אין ממצא שמצדיק מחיקה/הפסקה של MCP או Langfuse, ואין הצדקה להמציא מדדי תפוצה. הנקודות שנותרו פתוחות הן זמינות גרסת NuGet C# בעת מעבדה, first-launch dates של התוספות, התאמת Hebrew/latency/cost בניסוי, והכרעת המשתמש בדבר החלופות והעדיפויות. אלה מסומנות כמגבלות ואינן ראיה לכשל מוצר.

המלצת ליבה ממוקדת:09—T09-01–04,T09-06,T09-09; יתר כלי09 לבחירה לפי צורך.10—Q10-01–06,Q10-10; backends חלופיים והעשרה לא נדרשים לאותו פרויקט לימוד. ניתן לאשר את מלוא19 ההצעות כקטלוג להשוואה בלי לפרש זאת כחובת התקנת כל המוצרים. כל חבילה נשארת pending_review/approval:null עד לאישור מפורש, ואין שינוי קטלוג במסגרת הביקורת.

אימות סופי בקריאה חוזרת של דוח10: Phoenix מופיעה בטבלה כ־enrichment והסתירה03/04 באוגוסט ב־OWASP מסומנת ללא יום מוצע לפרסום. **אין חסימה להצגת שני הדוחות למשתמש לאישור.** נדרש אישור נפרד להחלה, והביקורת אינה אישור כזה.
