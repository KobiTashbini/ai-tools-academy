# קטגוריה 05 — מחקר Vector Databases

דוח: **vector05-20261102-v1**. מצב: **V05-01–V05-08 אושרו ויושמו** ב־2026-11-02 באמצעות מיגרציה 009. המחקר המקורי נערך סביב 20:42–20:45 UTC. גוף ההמלצות נשמר להלן כתיעוד ההחלטה; מצב המימוש מפורט בסוף. לא בוצעו Commit, Push או Deployment.

## בסיס וכיסוי

נקרא Supabase בטרנזקציות לקריאה בלבד. בבסיס מ־2026-11-02T20:42:24.265Z: 50 מסמכי קטלוג, וכל 50 הזהויות/המקורות נבדקו מול המועמדים למניעת כפילויות. ב־05 קיימת **רק Qdrant**, revision=2, published, verifiedAt=2026-10-31, חשיבות should_know. נבדקה רשומה קיימת אחת מתוך אחת; לא בוצע אימות עובדות של 49 הרשומות האחרות. תור ההצעות המקומי והטבלה במסד ריקים. אין מועמד מהשורטליסט שכבר מופיע כרשומה נפרדת באתר. בסיס מפורט: research/evidence/vector05-baseline-2026-11-02.json.

נערכו חיפושים לפי מסד ייעודי, הרחבת SQL, חיפוש hybrid ארגוני, שירות מנוהל, אחסון משובץ וספריית ANN. בין שאילתות הגילוי: Qdrant official clients/hybrid, vector store connectors C#, SQL vector search 2025 preview, vector search hybrid C# client, MongoDB vector search C#, SQLite extensions ו־turbopuffer SDK. נעשה שימוש גם ב־[מטריצת Microsoft](https://learn.microsoft.com/en-us/semantic-kernel/concepts/vector-store-connectors/out-of-the-box-connectors/) כדי לגלות חלופות, ולא כתחליף לתיעוד הספק. המטריצה עצמה מסומנת Preview ויכולה לפגר אחרי SDKs חדשים.

## המלצה לפי סדר חשיבות

הסדר להלן הוא המלצה פדגוגית לרקע C#/SQL, לא דירוג נתח שוק או ביצועים. אין צורך ללמוד לעומק את כל המוצרים. יש לשמור על 12 הקטגוריות ועל סוגי הפריט הקיימים; התפקיד המפורט מבהיר הרחבה לעומת מסד עצמאי.

| ID | פעולה מוצעת | סוג/חשיבות מוצעים | ערך, מגבלה ומקור |
| --- | --- | --- | --- |
| V05-01 | הוספת ״חיפוש וקטורי — יסודות ובחירת אחסון״ | concept / must_learn | exact מול ANN; HNSW/IVFFlat; recall, latency וסינון; חיפוש טקסטואלי מול dense/sparse/hybrid; הרשאות, עדכון ומחיקה. להשוות מסד SQL קיים למסד ייעודי ולשירות חיפוש. זו סינתזה לימודית, לא מוצר נוסף. [pgvector](https://github.com/pgvector/pgvector), [Qdrant hybrid](https://qdrant.tech/documentation/search/hybrid-queries/). |
| V05-02 | הוספת pgvector | database, בתיאור ״הרחבת PostgreSQL״ / should_know | המועמד החשוב ביותר למסלול מעשי: SQL, joins ווקטורים באותה מערכת. .NET דרך pgvector-dotnet עם Npgsql, EF Core ו־Dapper. מחייב מדידה ואינדקס מתאים; לא הבטחה ש־Postgres תמיד מספיק. [מאגר](https://github.com/pgvector/pgvector), [לקוח .NET](https://github.com/pgvector/pgvector-dotnet). |
| V05-03 | תיקון Qdrant הקיימת, ללא כפילות | database / should_know נשמרת | SDKs רשמיים, ובמיוחד Qdrant.Client ל־.NET מעל gRPC; הרחבת התיאור גם ל־dense/sparse/multivector ו־hybrid; שמירת ההדרכה על סינון, מחיקה והרשאות. פירוט לפני/אחרי להלן. |
| V05-04 | הוספת Azure AI Search | platform, שירות חיפוש מנוהל / should_know | lexical+vector+hybrid ו־SDK .NET רשמי; מייצג חיפוש ארגוני רחב ממסד וקטורי. תלות Azure, עלות ומכסות; אינו Azure OpenAI ואינו כפילות של Foundry. [סקירה](https://learn.microsoft.com/en-us/azure/search/vector-search-overview), [Quickstart C#](https://learn.microsoft.com/en-us/azure/search/search-get-started-vector?tabs=api-key). |
| V05-05 | הוספת Weaviate | database / should_know | חלופה ייעודית עם חיפוש hybrid ואינטגרציות. C# SDK רשמי; נדרש שרת 1.32+ ו־gRPC. תפעול ורישוי מהדורות דורשים בחינה. [C#](https://docs.weaviate.io/weaviate/client-libraries/csharp), [רישיון](https://github.com/weaviate/weaviate/blob/main/LICENSE). |
| V05-06 | הוספת Milvus | database / should_know | משלים השוואה למסד ייעודי ולפריסה מבוזרת; קיימים גם מסלולים מקומיים ולא רק אשכול מורכב. להפריד Milvus פתוח מ־Zilliz Cloud. SDK C# V2 רשמי קיים; לא להסתמך על הוראות V1 הישנות. [תיעוד](https://milvus.io/docs/overview.md), [SDK C#](https://github.com/milvus-io/milvus-sdk-csharp/blob/main/README.md). |
| V05-07 | הוספת Pinecone | platform, שירות מסד מנוהל / should_know | מייצג פתרון מנוהל ו־API במקום תפעול עצמי. חשוב להשוואה, אך SDK .NET הרשמי מאורכב; לא השירות כולו. יש עלות ותלות ספק ואין להסיק תמיכה משוויון ל־Python/TS. [השקה](https://www.pinecone.io/newsroom/pinecone-leaves-stealth-with-usd10m-launches-first-serverless-vector-database-for-machine-learning/), [מצב .NET](https://learn.microsoft.com/en-us/semantic-kernel/concepts/vector-store-connectors/out-of-the-box-connectors/pinecone-connector). |
| V05-08 | הוספת Chroma כהרחבה אופציונלית | database / enrichment | דוגמה נוחה לאחסון retrieval מקומי/שרת/ענן; Python, TypeScript ו־Rust מופיעים ב־[תיעוד הלקוחות](https://docs.trychroma.com/docs/run-chroma/clients). לא אומת SDK .NET רשמי פעיל. אין לתאר אותה כצעצוע לפיתוח בלבד, או להניח שכל יכולת ענן זמינה בכל מסלול. [סקירה](https://docs.trychroma.com/docs/overview/introduction), [מאגר](https://github.com/chroma-core/chroma). |

**היקף האישור המומלץ:** V05-01–V05-07; V05-08 אופציונלית. כך מוסיפים יסודות וחמישה כלים, ומשפרים את Qdrant הקיימת. להתחיל מעשית ביסודות → pgvector → Qdrant; יתר הכלים מיועדים בתחילה להשוואה ולהיכרות, לא לתרגול חובה בכל מוצר.

**SQL Server / Azure SQL ראויה להתייחסות מוקדמת בתוך V05-01**, ולא להיעלם ברשימת שוליים: יש SqlVector<T> ב־Microsoft.Data.SqlClient. יש להבחין בין vector datatype/functions לבין ANN index ו־VECTOR_SEARCH. האחרונים GA ב־Azure SQL/Fabric וב־MI במסלול Always-up-to-date, אך Preview ב־SQL Server 2025 וב־MI במסלול 2025. לא מוצעת כרגע רשומה כפולה לכל מהדורה. [SqlClient](https://learn.microsoft.com/en-us/sql/connect/ado-net/sql/vector-data-sql-server?view=sql-server-ver17), [סטטוס לפי מוצר](https://learn.microsoft.com/en-us/sql/t-sql/functions/vector-search-transact-sql?view=fabric-sqldb).

## תיקון הרשומה הקיימת: Qdrant

| שדה/נושא | מצב נוכחי מאומת במסד | הצעה |
| --- | --- | --- |
| שפות ותמיכה | Python ו־HTTP API; הערה ש־C# ו־TS SDKs לא אומתו | לאמת ולתעד SDKs רשמיים Python, JS/TS, .NET, Rust, Go, Java. ל־C# לציין Qdrant.Client ו־gRPC, לא רק HTTP. [רשימת הספק](https://qdrant.tech/documentation/interfaces/), [SDK](https://github.com/qdrant/qdrant-dotnet). |
| תיאור ותוכן | חיפוש דמיון וקטורי כללי | להוסיף dense/sparse ומיזוג hybrid, ולהפריד איכות embeddings, שליפה ו־reranking; לא לשנות את הסיווג למסגרת RAG. [Query API](https://qdrant.tech/documentation/search/hybrid-queries/). |
| מדידות | 35,343 Stars, צילום 31/10/2026 | צילום חדש: 35,390 Stars ו־2,793 Forks. Commit ראש master נשאר 21/10/2026; אסור לתארו כ״עודכן היום״ רק כי Stars נמדדו מחדש. המקורות וה־SHA בקובץ הראיות. |
| השקה | חסרה | אפשר לתעד v1.0.0 ב־08/02/2023 כאירוע גרסה יציבה, **לא** כתחילת הפרויקט. About של הספק מספר על 2021, בעוד יצירת המאגר ב־2020 אינה הוכחת השקה. אם רוצים דווקא השקה ראשונה, להשאיר לא מאומתת עד פתרון. [v1.0.0](https://github.com/qdrant/qdrant/releases/tag/v1.0.0), [סיפור הספק](https://qdrant.tech/about-us/). |
| חשיבות/אבטחה | should_know, תרגיל על הרשאות ומחיקה | לשמור; אין ראיה להורדת חשיבות או Legacy. דמיון אינו הרשאה; מסנן tenant נגזר משרת. |
| חלופות ומקורות | pgvector/Pinecone/Weaviate כ״לבדיקה בהמשך״, מקור יחיד | אם אושרו התוספות, לקשר לרשומות החדשות ולמקורות הספציפיים; לשמר מקורות קיימים. |

אין המלצת הסרה או מיזוג לרשומה הקיימת. התוכן הבסיסי תקין; הפערים הם דיוק תמיכה, רוחב יכולות ומידע חסר.

## מדידות GitHub ותחזוקה

נאספו דרך חיבור GitHub, סביב **2026-11-02T20:42:53Z**; לכל מדידה זמן מדויק, מקור API, Forks, branch, SHA וקישור commit בקובץ research/evidence/vector05-github-2026-11-02.json. אלה נתוני עניין ופעילות בלבד, ללא ציון יחסי חדש. Commit הוא committer date של ראש ענף ברירת המחדל; pushed_at או תאריך crawl אינם תחליף.

| מאגר | Stars | Forks | Commit UTC | archived |
| --- | ---: | ---: | --- | --- |
| [Qdrant](https://github.com/qdrant/qdrant) | 35,390 | 2,793 | 2026-10-21 | לא |
| [pgvector](https://github.com/pgvector/pgvector) | 23,569 | 1,379 | 2026-10-31 | לא |
| [Weaviate](https://github.com/weaviate/weaviate) | 16,934 | 1,433 | 2026-11-02 | לא |
| [Milvus](https://github.com/milvus-io/milvus) | 46,564 | 4,325 | 2026-11-02 | לא |
| [Chroma](https://github.com/chroma-core/chroma) | 29,625 | 2,604 | 2026-10-22 | לא |
| [LanceDB](https://github.com/lancedb/lancedb) | 11,832 | 1,150 | 2026-11-02 | לא |
| [Vespa](https://github.com/vespa-engine/vespa) | 7,157 | 750 | 2026-11-02 | לא |
| [Redis](https://github.com/redis/redis) | 77,149 | 25,037 | 2026-11-02 | לא |
| [OpenSearch](https://github.com/opensearch-project/OpenSearch) | 13,951 | 3,117 | 2026-11-02 | לא |

Pinecone ו־Azure AI Search: אין כאן מאגר ליבת מסד ציבורי מייצג למדידה; אין להשתמש ב־Stars של SDK/דוגמאות. מאגר Pinecone .NET המאורכב נבדק בנפרד, ולא נכלל במדדי המוצר. אי־ארכוב הוא תצפית, לא הבטחת תחזוקה או אבטחה.

## שפות, גרסאות, רישיונות ותאריכים רגישים

- **pgvector:** הרחבת שרת עם לקוחות בשפות שונות, לא שרת Python. ב־[Changelog](https://raw.githubusercontent.com/pgvector/pgvector/master/CHANGELOG.md): first release ב־20/04/2021; 0.8.7 ב־01/10/2026; 0.9.0 עדיין unreleased. רישיון השרת בנוסח PostgreSQL; לקוח .NET ברישיון MIT. [רישיון](https://raw.githubusercontent.com/pgvector/pgvector/master/LICENSE).
- **Weaviate:** C# SDK 1.2.0 דורש שרת 1.32+ ופורט gRPC. Python/TS/Java/Go מופיעים ברשימת הלקוחות הרשמית. רישיון המאגר **מעורב**: BSD-3-Clause מחוץ ל־wl/, וקוד enterprise בתוכו ברישיון נפרד. אין לתאר את כל המאגר כ־BSD בלבד. לא נקבע יום השקה בהיעדר ראיית אירוע מדויקת בדוח זה.
- **Milvus:** ה־README הנוכחי מתעד Milvus.Client.V2, עם V1 היסטורי. לפי [Changelog](https://github.com/milvus-io/milvus-sdk-csharp/blob/main/CHANGELOG.md), גרסת לקוח 3.0.0 פורסמה ב־23/10/2026 לתאימות Milvus 3.0.x. להעדיף מסלול .NET 8 המתועד ב־README ולבדוק תאימות לפני תרגול; רשימת target frameworks מפורטת בדף V2 אינה הבטחת parity לכל מערכת. השרת Apache-2.0; אין להסיק מרישיון השרת על תנאי Zilliz Cloud. פתיחת הקוד מתועדת ב־2019; מקורות הספק סותרים בחודש (אוקטובר לעומת נובמבר), ולכן מוצע דיוק שנה בלבד. [סקירת 2021](https://milvus.io/blog/2022-01-07-year-in-review.md), [סיפור 2025](https://blog.milvus.io/ja/blog/journey-to-35k-github-stars-story-of-building-milvus-from-scratch.md).
- **Pinecone:** הכרזה רשמית מתוארכת 27/01/2021 מאמתת זמינות self-onboarding אז, לא השקת כל API נוכחי. [SDK .NET](https://github.com/pinecone-io/pinecone-dotnet-client) מאורכב מ־03/07/2026 לפי הודעת GitHub; [Microsoft](https://learn.microsoft.com/en-us/semantic-kernel/concepts/vector-store-connectors/out-of-the-box-connectors/pinecone-connector) מאשרת הפסקת תמיכה. שירות המסד אינו מסומן Legacy. מסלול .NET הוא API או לקוח שנבדק בנפרד, ללא הבטחת SDK ספק פעיל. דף SDK ישן של הספק לא היה נגיש בסבב זה.
- **Azure AI Search:** .NET דרך Azure.Search.Documents, לצד SDKs אחרים. שירות מסחרי; תאריך GA של vector search ב־2023 אינו תאריך הקמת Azure Search. [הכרזת GA](https://techcommunity.microsoft.com/blog/azure-ai-services-blog/announcing-general-availability-of-vector-search-and-semantic-ranker-in-azure-ai/3978525).
- **Chroma:** Apache-2.0 לליבה; תנאי Cloud נפרדים. [חבילת chromadb 0.1.0](https://pypi.org/project/chromadb/0.1.0/) מתועדת ב־15/02/2023; זה אירוע חבילה, לא הוכחה שהפרויקט לא התקיים קודם. [סקירת המוצר](https://docs.trychroma.com/docs/overview/introduction) כוללת dense/sparse/hybrid, ואין להשליך זמינות זהה לכל גרסה/מסלול בלי אימות נוסף.

ודאות גבוהה: בסיס המסד, ספירות המדידה, Qdrant .NET, Weaviate .NET/רישוי, Pinecone .NET, pgvector .NET. ודאות בינונית: סדר חשיבות הוא שיקול פדגוגי; הגדרות תאימות משתנות ודורשות בדיקה בעת המימוש. תאריכי השקה לא פתורים נשארים חסרים.

## מועמדים נוספים והחלטת דחייה

| מועמד | למה משמעותי / למה לא בגל הראשון | מקור |
| --- | --- | --- |
| SQL Server / Azure SQL | חשוב מאוד לרקע המשתמש; להשוות כבר בפרק היסודות. רשומה נפרדת בעתיד לפי צורך, עם הפרדת GA/Preview. | [VECTOR_SEARCH](https://learn.microsoft.com/en-us/sql/t-sql/functions/vector-search-transact-sql?view=fabric-sqldb) |
| LanceDB | OSS היא ספריית retrieval משובצת; Enterprise היא multimodal lakehouse. Python/TS/Rust מסלולים מרכזיים; לא אומת SDK .NET רשמי. חפיפה מעבר לאחסון וקטורי, לכן enrichment בהמשך. | [תיעוד](https://docs.lancedb.com/) |
| Vespa | מנוע חיפוש ודירוג hybrid מתקדם; ערך רב למערכות חיפוש מורכבות, עם עקומת למידה רחבה יותר. | [מעבדת hybrid רשמית](https://learn.vespa.ai/vector-search/lab-hybrid/) |
| Elasticsearch / OpenSearch | חיפוש lexical+vector בתשתית קיימת, לקוחות .NET. מועמדים לגל שני; אינם אותו מוצר או אותו רישיון. Elastic דורשת בדיקת מהדורה/רישוי; OpenSearch Apache-2.0. | [Elastic](https://www.elastic.co/docs/solutions/search/vector), [OpenSearch](https://docs.opensearch.org/latest/vector-search/) |
| Redis vector search | טוב כש־Redis כבר קיים; .NET דרך NRedisStack. לא להצדיק שירות נוסף רק לשם גיוון. Redis 8 אינו BSD בלבד; יש בחירות AGPLv3/RSALv2/SSPLv1 לפי גרסה. | [תרגול .NET](https://redis.io/docs/latest/develop/clients/dotnet/nredisstack/vecsearch/), [רישיונות](https://redis.io/legal/licenses/) |
| turbopuffer | חלופה מנוהלת משמעותית עם C# SDK רשמי ודגש אחסון/חיפוש; לא לטעון שאין .NET. יש להשלים בדיקת מגבלות/עלות/היסטוריית שירות לפני המלצת הוספה. | [Quickstart](https://turbopuffer.com/docs/quickstart), [C#](https://github.com/turbopuffer/turbopuffer-csharp) |
| SQLite vec1 / sqlite-vec | מסלולים משובצים נפרדים; vec1 מתועדת באתר SQLite עם ANN, ו־sqlite-vec היא פרויקט אחר. אין לאחד זהויות. מעקב לפני רשומה נפרדת; נדרשת בדיקת הפצה ויציבות. | [vec1](https://www3.sqlite.org/vec1.html), [sqlite-vec](https://alexgarcia.xyz/sqlite-vec/) |
| FAISS | ספריית C++/Python ל־similarity/ANN, לא מסד מלא עם auth ושירות CRUD. מתאים כחומר השוואה ביסודות. | [Meta](https://engineering.fb.com/2017/03/29/data-infrastructure/faiss-a-library-for-efficient-similarity-search/) |
| MongoDB / Cosmos DB / Oracle / Couchbase | אותרו בחיפוש רוחבי. רלוונטיים במיוחד למי שכבר משתמש בהם, אך לא הושלם כאן audit מוצר/רישוי/גרסאות מלא ואין המלצת הוספה בשלב זה. | [מטריצת Microsoft](https://learn.microsoft.com/en-us/semantic-kernel/concepts/vector-store-connectors/out-of-the-box-connectors/), [MongoDB C#](https://www.mongodb.com/docs/drivers/csharp/current/atlas-vector-search/) |

## ביקורת עצמאית ומגבלות

שני סוכני מחקר בדקו בנפרד מסדים ייעודיים ואחסון SQL/חיפוש מנוהל; סוכן שלישי ביצע ביקורת עצמאית במקורות רשמיים. המוביל קרא את הבסיס החי, בדק כפילויות, אסף מדידות והצליב טענות קריטיות. הביקורת הובילה להעדפת בסיס קטן ללימוד, הדגשת SQL Server מוקדם, מניעת תיאור Chroma כצעצוע, והפרדה בין Milvus C# V1 ל־V2. אין כאן המלצה לרכישת שירות או שינוי ארכיטקטורת האקדמיה עצמה.

לא הורצו SDKs/מסדים, לא נמדדו recall/latency/מחיר או עברית, ולא הובטח parity בין שפות. לא אומתה שנת השקה לכל מועמד משני. נתוני ספק על הצלחה/ביצועים אינם ראיות בלתי תלויות. דפי Microsoft שהציגו הודעת authorization עדיין סיפקו טקסט מאמר; דפים שלא נקראו לא שימשו להוכחת טענות. GitHub connector אפשר מדידה מדויקת ללא שימוש ב־Stars מעוגלים ממנוע חיפוש.

לא שונה research/proposals.json: חלק מההמלצות חורגות מסוגי ההצעות הישנים והוולידטור עדיין משווה ל־35 פריטי ייבוא היסטורי. ה־IDs בדוח הם יחידות האישור. אין להסתמך על research:check כאימות היקף המחקר החי.

**החלטת המשתמש:** אושרו V05-01–V05-08, כולל Chroma, תיקוני Qdrant ותרחיש מעשי לכל כלי שמסביר בחירה וחלופה. כל יתר המועמדים נדחים להמשך; אין אישור ל־Commit, Push או פריסה.

## מצב יישום לאחר האישור

- נוספו שבע רשומות: יסודות, pgvector, Azure AI Search, Weaviate, Milvus, Pinecone ו־Chroma. Qdrant עודכנה מ־revision 2 ל־3; אין כפילות. כעת 57 פרקים באתר ושמונה ב־05.
- נשמרו כל הסעיפים והמקורות הישנים של Qdrant ונוספו SDKs, hybrid, תרחיש בחירה, חלופות ומקורות ספציפיים. נשמרו סוגה, חשיבותה ותאריך הוספתה המקורי. אין סימון Legacy לשירות Pinecone או ל־Milvus כולו בגלל לקוח היסטורי.
- לכל כלי נוספו פרק, תרחיש לימודי שלא הורץ, מתי לבחור ומתי חלופה, תרגיל, שפות/.NET, חשיבות מנומקת, מקורות וקישורי השוואה. מדריך קריאה בן שבעה שלבים מציג את סדר הלימוד. נשמרו הבדלי רישוי ו־GA/Preview; שנת Weaviate נותרה חסרה כי לא אומתה.
- חמש תצפיות GitHub מהצילום המקורי המאושר נקשרו למאגרים הראשיים בלבד: Qdrant, pgvector, Weaviate, Milvus ו־Chroma. לא בוצע איסוף חוזר שמתחזה לחדש; נשמרו timestamps, SHA ומקורות. לשירותים ולמושג אין Stars ממאגר SDK/דוגמאות, ואין ציון Interest חדש.
- בדיקת preflight מול Supabase אישרה שהמסמך המלא של Qdrant לא השתנה מאז המחקר. מיגרציה 009 הוחלה ואומתה בענן. לא השתנו מבנה הטבלאות, הרשאות, סודות, קוד runtime או עיצוב. 49 הפרקים האחרים נשמרו, וכן הארכיון, מדגמי Interest והמדריכים הקודמים.
- עברו 36 בדיקות npm test, בדיקת טיפוסים ו־Production Build; כל 74 נתיבי Production עברו בבדיקת smoke מול Supabase. בדפדפן אומתו שמונה רשומות וכרטיסיות, מיון Stars והיעדר גלישת עמוד ברוחב 390px. research:check עבר לתור ריק ול־35 פריטי הייבוא ההיסטורי בלבד; אינו הוכחת כיסוי לקטלוג החי. הפירוט ב־PROJECT_STATUS.md.
- לא נוספו יתר המועמדים. SQL Server/Azure SQL ו־FAISS נידונים בפרק היסודות בלבד. לא הורצו מסדי הכלים או SDKs ולא נמדדו ביצועים, עלות או איכות עברית.
