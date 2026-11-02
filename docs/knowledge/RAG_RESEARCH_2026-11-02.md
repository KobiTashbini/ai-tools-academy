# מחקר RAG & Knowledge Systems — מצב יישום

תאריך: 2026-11-02. המשתמש אישר הוספת DSPy, txtai ו־Pathway ותיקון שמונה הרשומות הקיימות. ההמלצות בתחום זה יושמו ב־Supabase באמצעות מיגרציה 008. כעת בקטגוריה 11 רשומות ובאתר 50 פרקים מפורסמים. לא נוספו מועמדים אחרים.

## תוספות שיושמו

| כלי | תפקיד והמלצת לימוד | שפות ו־.NET | מקור רשמי |
| --- | --- | --- | --- |
| DSPy | מסגרת לתוכניות מודל ואופטימיזציה מול מדדים; should_know. להשוות לזרימות LlamaIndex/Haystack, תוך הפרדת נתוני אימון ובדיקה ועלות האופטימיזציה. | Python; לא אומת SDK ליבה מקומי ל־C#. אפשר לתכנן שירות נפרד. | [תיעוד](https://dspy.ai/), [מאמר 2023](https://arxiv.org/abs/2310.03714) |
| txtai | מסגרת חיפוש סמנטי, SQL ועיבוד משולב; should_know. חלופה קומפקטית לתהליכים מסוימים ב־LlamaIndex/Haystack, עם בחינת אחסון, הרחבה ופריסה. | Python ו־HTTP API; לא אומת binding רשמי ל־C#. | [תיעוד](https://neuml.github.io/txtai/), [API](https://neuml.github.io/txtai/api/), [חבילה 2020](https://pypi.org/project/txtai/1.0.0/) |
| Pathway | מסגרת לעיבוד מתמשך ועדכונים מצטברים; should_know. להשוות לאינדוקס מחזורי לפני הוספת תהליך מתמשך ומצב תפעולי. | Python API ומנוע Rust; אין להסיק מכך API ציבורי מקביל ב־Rust. .NET באמצעות שירות/HTTP מתוכנן. | [תיעוד](https://pathway.com/developers/user-guide/introduction/welcome/), [Open Beta 2022](https://pathway.com/framework/blog/pathway-open-beta-announced/), [רישיון](https://github.com/pathwaycom/pathway/blob/main/LICENSE.txt) |

לכל אחת נוספו תיאור, שימושים, חמישה סעיפי לימוד, דוגמה ותרגיל מוצעים, חסרונות וחלופות, קשרים לרשומות קיימות, חשיבות ומקורות. הדוגמאות לא הורצו כיישומי Python ולא נמדדו ביצועי הכלים. Pathway מתוארת עם BSL ותנאים נוספים, ללא טענה לרישיון מתירני רגיל. Serviette מוסברת כמוצר קשור ולא כרשומה נוספת.

## תיקונים שיושמו

| רשומה קיימת | השינוי |
| --- | --- |
| RAG יסודות | נוסף הסבר על מימוש .NET, הערכה, הרשאות ומקורות, עם [Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/ai/conceptual/rag). אין תאריך השקה למושג. |
| LlamaIndex | Python נשארת פעילה; TypeScript מסומנת Legacy ברמת השפה לפי [הודעת Deprecated במאגר](https://github.com/run-llama/LlamaIndexTS). הפריט כולו אינו Legacy. נוספה שנת 2022 לפי תיאור הספק, ללא המצאת יום. |
| Haystack | הופרד פרסום farm-haystack ב־2019 מהשקה רשמית ב־2020 ומגרסאות נוכחיות. ארכוב החבילה ההיסטורית אינו ארכוב המסגרת. [חבילה](https://pypi.org/project/farm-haystack/0.1.0.post2/), [הסבר הספק](https://haystack.deepset.ai/blog/haystack-2-release/). |
| RAGFlow | תוקנו התיאור והשפות: ליבת Go בענף שנבדק, Python SDK ו־HTTP כשכבות נפרדות. הובהר שמדובר גם ב־RC ולא בהבטחת גרסה יציבה. [go.mod](https://github.com/infiniflow/ragflow/blob/main/go.mod), [RC3](https://github.com/infiniflow/ragflow/releases/tag/v1.0.0-rc3), [פרסום 2024](https://github.com/infiniflow/ragflow/releases/tag/v0.1.0). |
| Docling | הובהר תפקיד ספריית הכנת מסמכים, ללא הצגתה כמערכת RAG מלאה. שנת 2024 לפי פרסום הקוד ביולי, ולא מועד כתבה מאוחרת. [IBM](https://research.ibm.com/blog/docling-generative-AI). |
| Unstructured | הופרדו הספרייה והשירות המסחרי. תאריך 2022 מתאר חבילת פיתוח מתועדת, ללא טענה לגרסה יציבה. [החבילה](https://pypi.org/project/unstructured/0.0.1.dev0/). |
| Microsoft GraphRAG | הופרדו הגישה הכללית והמימוש המסוים; מותג Microsoft אינו הוכחה ל־SDK .NET. תועד פרסום GitHub ביולי 2024. [Microsoft Research](https://www.microsoft.com/en-us/research/project/graphrag/). |
| LightRAG | הובהר הקשר ל־RAG-Anything בלי להוסיף אותה או לחבר Stars. תועד פרסום חבילת lightrag-hku ב־2024, תוך הבחנה משמות דומים. [חבילה](https://pypi.org/project/lightrag-hku/0.0.2/), [RAG-Anything](https://github.com/HKUDS/RAG-Anything). |

כל שמונה הרשומות קיבלו revision ותאריך אימות מעודכנים. הסיווג, החשיבות, מצב הפרסום, המקורות והסעיפים הישנים נשמרו; נוספו הבהרות ומקורות. מדריך הקריאה עודכן לשבעה שלבים. אין מחיקת רשומות.

## מדידות ודיוק המידע

נשמרו עשר תצפיות GitHub, כולל Stars, Forks, SHA, תאריך Commit וזמן איסוף. אלה מדדי עניין ופעילות, לא איכות RAG, נתח שוק או תאריך עדכון כל התיעוד. לא חושב GitHub Interest מחדש.

הצילום הוא מהמחקר שאושר: `2026-11-02T20:09:32.515Z`. ניסיון רענון נוסף נתקל במגבלת GitHub API (403); לא הוצג כאילו בוצע איסוף חדש. נתוני המקור וזמנם נשמרו ב־`database/evidence/rag-review-2026-11-02.json`.

| מאגר רשמי | Stars בצילום | Commit אחרון בצילום, UTC |
| --- | ---: | --- |
| [DSPy](https://github.com/stanfordnlp/dspy) | 38,891 | 2026-11-02 |
| [txtai](https://github.com/neuml/txtai) | 13,062 | 2026-11-01 |
| [Pathway](https://github.com/pathwaycom/pathway) | 62,025 | 2026-10-30 |
| [LlamaIndex](https://github.com/run-llama/llama_index) | 52,779 | 2026-10-14 |
| [Haystack](https://github.com/deepset-ai/haystack) | 26,913 | 2026-11-02 |
| [RAGFlow](https://github.com/infiniflow/ragflow) | 93,365 | 2026-11-02 |
| [Docling](https://github.com/docling-project/docling) | 70,016 | 2026-11-01 |
| [Unstructured](https://github.com/Unstructured-IO/unstructured) | 15,672 | 2026-11-02 |
| [Microsoft GraphRAG](https://github.com/microsoft/graphrag) | 36,531 | 2026-11-02 |
| [LightRAG](https://github.com/HKUDS/LightRAG) | 40,487 | 2026-10-14 |

בצילום עשרת המאגרים אינם מאורכבים. זו תצפית תחזוקה, לא התחייבות לתמיכה עתידית. תאריך השקה נשמר עם האירוע והדיוק שנמצאו: שנה בלבד כשאין יום מאומת, ופרסום חבילה או Beta כשזה האירוע המתועד.

## נשאר להמשך — לא פורסם במסגרת אישור זה

מועמדים מהדוח נשארים לבדיקה ואישור נפרדים: Cognee, RAG-Anything ו־Onyx; Serviette נידונה בתוך Pathway בלבד. R2R, Cinnamon, FastGPT ו־Quivr דורשות השלמת בדיקת התאמה, גרסה, פעילות ורישוי לפני המלצת הוספה. Cognita ו־Kernel Memory דורשות התייחסות למצב התחזוקה/ארכוב ולא הוספה אוטומטית. אין ברשימה זו אישור לפרסום, ואין להסתמך על מדדים שלא אומתו מחדש.

נשארו גם בדיקות מעשיות על מסמכים בעברית, השוואות עלות/איכות/רעננות והרצת הדוגמאות. תהליך המחקר הישן עדיין בודק את 35 פריטי הייבוא ההיסטורי; העברתו לקטלוג DB חי היא משימה נפרדת.

## מימוש ובדיקות

מיגרציה 008 הוחלה ואומתה ב־Supabase. אין DDL, שינוי בהרשאות, סודות, קוד runtime או עיצוב. האתר ממשיך לקרוא מהמסד; seeds וראיות מקומיות הם קלט מיגרציה ובדיקות בלבד. נשמרו הארכיון, מדגמי Interest ותוכן כל הרשומות שמחוץ לקטגוריה. קיימות הגנות גרסה, revision, כפילויות והרצה חוזרת.

עברו 35 בדיקות ב־`npm test`, בדיקת טיפוסים, `research:check` ו־Production Build, וכן כל 67 נתיבי Production בבדיקת smoke מול Supabase. `research:check` מוגבלת לתהליך ההיסטורי האמור; בדיקת האינטגרציה החדשה מכסה את שלוש התוספות ושמונת התיקונים מול PostgreSQL מקומי, ובדיקת ההחלה מאמתת את מסד הענן. לא בוצעה בדיקה חזותית חדשה. לא בוצעו Commit, Push או פריסה.
