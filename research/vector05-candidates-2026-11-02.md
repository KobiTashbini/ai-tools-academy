# מועמדי 05 — מחקר משנה, 2026-11-02

מחקר בלבד; אין שינוי בקטלוג. נקודת הבסיס שקיבלתי מהסוכן הראשי: ב־05 קיימת רק Qdrant; נבדקו זהויות כל 50 הרשומות. נתוני GitHub המדויקים נאספו בנפרד בידי הסוכן הראשי. ניסיון REST מקומי כאן נכשל; לא הופקו מספרים מדויקים מ־HTML מעוגל.

## המלצות

1. **Weaviate — should_know, platform:** מסד ייעודי להמחשת hybrid search, filtering וסכמת אובייקטים לצד Qdrant. תמיכה רשמית ב־Python/TS/Java/Go/**C#**. C# SDK v1.2.0 דורש Weaviate>=1.32 ופתיחת gRPC; אין להציגו כ־HTTP בלבד או להבטיח שוויון תכונות בין שפות. יתרון לימודי: חיפוש משולב ואפשרויות מודולים; חסרון: שירות נוסף, ניהול schemas, גרסאות וצריכת משאבים. **רישיון מעורב**: מחוץ ל־wl/ BSD-3-Clause; בתוך wl/ רישיון Enterprise. יש להימנע מתיאור בלתי מסויג של כל המאגר כ־BSD. שנת השקה ראשונה לא הוכרעה כאן ממקור ראשוני; לא להזין 2019 על סמך הקמת חברה/צד שלישי בלבד.
   - [C# רשמי](https://docs.weaviate.io/weaviate/client-libraries/csharp)
   - [ממשקים ושונות כיסוי שפות](https://docs.weaviate.io/weaviate/concepts/interface)
   - [LICENSE](https://github.com/weaviate/weaviate/blob/main/LICENSE)
   - [מאגר](https://github.com/weaviate/weaviate)

2. **Milvus — should_know, platform:** ערך מובחן בלימוד מסד מבוזר והפרדת אחסון/חישוב, על פני הוספת עוד API דומה. Apache-2.0; לשקול עומס תפעולי לעומת Qdrant/pgvector. Zilliz Cloud הוא שירות מנוהל קשור, לא מסד בלתי קשור ולא סיבה לחבר Stars. יש SDKים רשמיים במספר שפות, ובפרט **C# V2 חדש**: `Milvus.Client.V2`, gRPC, מטרות net8.0/netstandard2.0/net462. ה־README הראשי הישן על 2.2 אינו עדות מספקת למצב הנוכחי; CHANGELOG מתעד C#3.0.0 ב־2026-10-23. תיעוד Zilliz מורה על V2 לשרת3.0, אך עדיין צריך לקבע תאימות לפי הגרסה בדוגמה. פרסום קוד ב־2019 אומת; כתבות רשמיות סותרות October/November ולכן עדיף דיוק שנה ללא יום. שרת v3.0.5 פורסם ב־30 באוקטובר לפי GitHub, אך release notes עדיין pending; אין לייחס לו תכונות מתוך notes של3.0.3.
   - [C# V2 הרשמי](https://github.com/milvus-io/milvus-sdk-csharp/blob/main/docs/v2/README.md)
   - [C# Changelog](https://github.com/milvus-io/milvus-sdk-csharp/blob/main/CHANGELOG.md)
   - [SDK ותאימות](https://docs.zilliz.com/docs/install-sdks)
   - [תאריך היסטורי Oct2019](https://milvus.io/blog/2022-01-07-year-in-review.md)
   - [תאריך היסטורי Nov2019 הסותר חודש](https://blog.milvus.io/ja/blog/journey-to-35k-github-stars-story-of-building-milvus-from-scratch.md)
   - [שרת releases](https://github.com/milvus-io/milvus/releases)

3. **Chroma — should_know, platform:** מסלול embedded/local נוח להשוואת ניסוי קטן ושירות; אינו רק in-memory prototype. התיעוד מבחין Local/Single-node/Distributed ו־Cloud מנוהל. Apache-2.0 לקוד. לקוחות רשמיים Python/TypeScript/Rust; שפות אחרות לקוחות קהילה. לכן אין לייחס SDK C# רשמי; .NET יכול לגשת ל־API או ללקוח קהילה מזוהה. חולשה לימודית: הבחנה נדרשת בין deployment modes ובין סט תכונות API/Cloud; פשטות ההתחלה אינה הוכחת התאמה לפרודקשן. תאריך מאומת: חבילת chromadb0.1.0 פורסמה **2023-02-15**, לא שנת יסוד חברה2022. גרסה יציבה1.5.9 לצד nightly1.5.10.dev326; אין לתאר nightly כיציבה. שילוב צפוי בקטגוריה05, עם קישור ל־RAG04, ללא פריט כפול.
   - [SDK overview](https://docs.trychroma.com/reference/overview)
   - [architecture](https://docs.trychroma.com/reference/architecture/overview)
   - [חבילת0.1.0](https://pypi.org/project/chromadb/0.1.0/)
   - [releases](https://github.com/chroma-core/chroma/releases)

4. **LanceDB — enrichment, platform לפי enum הקיים, עם הסבר embedded retrieval library:** מוסיפה מודל אחסון טבלאי/קובצי Lance ומידע רב־מודלי; ערך גדול יותר כשיש workload מתאים, ולא כחובת לימוד נוספת לכל מפתח RAG. Apache-2.0 ל־OSS; להפריד Enterprise/Cloud מהספרייה המקומית. דף המוצר מציג Python/TypeScript/Rust; SDK reference גם Java, ולכן לתאר רמת Java בזהירות לפי SDK/גרסה. **לא אומת C# רשמי**; קיים לקוח קהילה מחוץ לארגון, אין להציגו כשווה ערך ל־SDK רשמי. HTTP מתייחס לשרת/שירות הרלוונטי, לא הבטחה שלכל ספרייה מקומית יש שרת REST מובנה. אירוע מאומת: Rust crate0.0.1 ב־2023-03-18 לפי docs.rs; GitHub v0.1 Hello World ב־20 באפריל (שנה יש לקבע ממטא־נתוני release לפני הזנת יום). v0.41.0 release ב־29 באוקטובר2026, לא בהכרח שווה לגרסתPython SDK.
   - [OSS לעומת Enterprise](https://docs.lancedb.com/)
   - [SDK reference](https://lancedb.github.io/lancedb/)
   - [חבילת Rust ותאריכים](https://docs.rs/crate/lancedb/latest)
   - [v0.1](https://github.com/lancedb/lancedb/releases/tag/v0.1)
   - [v0.41.0](https://github.com/lancedb/lancedb/releases/tag/v0.41.0)
   - [לקוח C# קהילתי בלבד](https://github.com/lennylxx/lancedb-csharp)

## הרחבת החיפוש ומועמדים להמשך

- **turbopuffer**: שירות וקטורי/טקסט על object storage; יש **SDK C# רשמי**. מועמד רלוונטי לשירות מנוהל, אבל אין צורך להוסיפו יחד עם כל החלופות לפני הצדקת ערך מול Pinecone. זמני השהיה ועלות בדף המבוא הם מדידות/טענות ספק, לא הבטחות שלנו. [quickstart](https://turbopuffer.com/docs/quickstart), [C#](https://github.com/turbopuffer/turbopuffer-csharp), [tradeoffs](https://turbopuffer.com/docs).
- **SQLite vec1**: תגלית מחיפוש תשתית מקומית; הרחבה רשמית נפרדת מ־sqlite-vec ומ־sqliteai/sqlite-vector. portable C, ANN IVFADC/OPQ, גרסה0.8 בדף. לא להוסיף לפני אימות אירוע פרסום, יציבות, packaging ושימוש .NET. [SQLite הרשמי](https://www3.sqlite.org/vec1.html).
- **Vespa**: מנוע חיפוש/serving עם vector/ranking, Apache2.0, אינו מסד וקטורי צר. מועמד השוואה/העשרה בעת צורך בדירוג מורכב, לא חובה להוסיף מיד. [מאגר רשמי](https://github.com/vespa-engine/vespa).
- נבדקו גם SQLite-Vector ו־sqlite-vec כהרחבות נפרדות; אין להסיק שהן אותו פרויקט בגלל השם. [SQLite-Vector](https://github.com/sqliteai/sqlite-vector), [sqlite-vec](https://github.com/asg017/sqlite-vec).

שאילתות כיסו: SDK C# וגרסאות, לקוחות שפות, רישוי, פריסות embedded/distributed, היסטוריית חבילות/releases, אחסון object storage, הרחבות SQLite ומנועי hybrid/ranking. התוצאות מבוססות מקורות רשמיים; תוצאות צד שלישי ששימשו לגילוי לא נלקחו כראיות. לא הורצו מוצרים, SDKים או benchmarks. המלצות החשיבות פדגוגיות, לא דירוג שימוש או נתח שוק. checkedAt המדויק של תצפיות GitHub נשמר אצל הסוכן הראשי; הדפים נפתחו בסבב2026-11-02.
