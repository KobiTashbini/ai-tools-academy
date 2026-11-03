# ביקורת עצמאית — קטגוריות07 ו־08

מזהה: models0708-review-20261103-v1. מבקר: models0708_review, סוכן נפרד משני החוקרים ומהסוכן הראשי. התחלה: 2026-11-03T09:37:03Z. סטטוס: ביקורת מחקר בלבד, ללא אישור פרסום. החלון הראשוני לאימות המקורות:09:37–09:39UTC. גרסאות הדוחות הסופיים יירשמו לאחר קריאתם; אין לייחס את הביקורת המקדימה לדוח שטרם נכתב.

## בסיס והיקף
נקרא research/evidence/models0708-baseline-2026-11-03.json:64 זהויות בכל סטטוס לבדיקת כפילות;14 רשומות ב־07 וארבע ב־08. הביקורת אינה audit נפרד לכל18 הפרקים אלא challenge ממוקד של דוחות החוקרים והטענות בעלות ההשפעה הגבוהה. המדדים נאספים מרכזית; המבקר לא חזר על קריאות API של GitHub.

## אימות עצמאי וטענות המחייבות דיוק

1. **סקר שימוש07 אומת, אך אינו נתח שוק.** [דף LLMs2026](https://survey.stackoverflow.co/2026/technology/data/llm) נפתח ומציג n=11,895 לשאלת ספקי מודלים ששימשו לעבודה בשנה האחרונה, בחירה מרובה, כולל שבעת הערכים שבבסיס. אין צורך להחליף את הנתונים הקיימים רק בגלל בדיקה חדשה. [מתודולוגיה](https://survey.stackoverflow.co/2026/methodology) מציינת30,903 תגובות תקפות, איסוף23/06–05/08/2026 וקהל שגויס מערוצי StackOverflow. אחוז לשאלת ספקים אינו אחוז מכלל המפתחים, שימוש בדגם מסוים או ביקוש למסלול לימוד. ספק Microsoft אינו מיפוי תקף ל־Foundry כפלטפורמה. רישיון הנתונים ODbL1.0 וייחוס נדרשים.

2. **רישיון משפחת מודלים אינו קבוע לכל גרסאותיה.** [Gemma terms](https://ai.google.dev/gemma/terms) נפתח: התנאים חלים על רשימת Appendix; הדף מפנה במפורש ל־[Gemma4 Apache2](https://ai.google.dev/gemma/apache_2), שנפתח גם הוא. לכן גם ״כל Gemma תחת תנאים מותאמים״ וגם ״כל Gemma Apache2״ שגויים. [Phi-4-mini-instruct](https://huggingface.co/microsoft/Phi-4-mini-instruct) מציין MIT; [Qwen3-8B](https://huggingface.co/Qwen/Qwen3-8B) מציין Apache2; [Llama4 Scout license](https://huggingface.co/meta-llama/Llama-4-Scout-17B-16E-Instruct/blob/main/LICENSE) מציין llama4. אלה תצפיות checkpoint נקודתיות, לא קביעה על כל הדגמים והנתונים של אותו ספק. המשקלים, קוד inference ושירות מנוהל מחייבים הבחנה.

3. **Ollama אינו מבטיח ריצה מקומית רק מפני שהכתובת localhost.** [Authentication](https://docs.ollama.com/api/authentication) נפתח: API מקומי אינו דורש אימות, direct cloud דורש מפתח, וניתן להפעיל cloud model גם דרך API מקומי. בפרק יש לציין מסלול מודל/endpoint ולבדוק פרטיות/egress; אין להבטיח local-only לכל שימוש ב־Ollama. מפתח לא בדפדפן וחשיפת שרת מחייבת תכנון הרשאות.

4. **LM Studio אינו רק GUI או HTTP גנרי.** [Developer docs](https://lmstudio.ai/docs/developer) נפתח: SDKs רשמיים TypeScript/Python, REST, compatibility endpoints, וכן llmster standalone/headless שאינו תלוי ב־GUI. .NET באמצעות HTTP אינו זהה ל־SDK .NET ייעודי מאומת. קיומם של compatible endpoints אינו הוכחת parity לכל משפחת API או לכל מודל.

5. **ONNX Runtime GenAI מתאים ל־.NET אבל Generate API עדיין Preview.** [C# generate API](https://onnxruntime.ai/docs/genai/api/csharp.html) נפתח ומציין Preview subject to change. יש להבדיל API native/binding ב־C# ממנוע שרת HTTP; לא להבטיח GA, כל execution provider, כל חומרה או כל checkpoint. גם אין להסיק מכלי inference רישיון לכל המשקלים.

6. **vLLM release metadata מכיל אי־אחידות שצריך לשמר.** [release v0.33.0rc3](https://github.com/vllm-project/vllm/releases/tag/v0.33.0rc3) נפתח: tag כולל rc3, title v0.33.0 ו־Latest, ו־API snapshot המרכזי מציין prerelease=false. אין לסווג אוטומטית יציבות או חוסר יציבות מהשם בלבד. הדוח צריך לשמור tag ותצפית ולהימנע מהבטחת production stability ללא בדיקה. [Installation](https://docs.vllm.ai/en/latest/getting_started/installation/) נפתח: יש מסלולי GPU/CPU/TPU; הפניה לקטגוריות התקנה אינה הוכחת תמיכה אחידה בכלOS/GPU/version.

7. **LiteLLM היא שכבת proxy/gateway, לא מנוע יצירת tokens מקומי.** [Quickstart](https://docs.litellm.ai/docs/proxy/quick_start) נפתח ומציג ניתוב, ממשק משותף, budgets ומפתחות. היא עשויה לפנות לספקי ענן או למנועים מקומיים. מיקום ב־08 צריך להסביר תפקיד תשתיתי; אין לשכפל אותה כספק מודל ב־07. דף /docs/proxy/security משוער לא נפתח, ולכן לא שימש ראיה לתכונת אבטחה.

## הנחיות לבדיקת הדוחות הסופיים
- 07: כיסוי מפורש לכל14 הרשומות, תיקוני SDK .NET לפי מוצר/version; אין להפוך API↔SDK↔hostedservice לזהות אחת. additions לפי ערך לימודי בלי מחזור latest-model-churn. שינוי עדיפות must_learn ל־should_know דורש נימוק חפיפה ולא metric בלבד.
- 08: להבחין desktop convenience, runtime/engine, GPU serving, in-process .NET ו־gateway; לא דירוג throughput אוניברסלי. חידוש מרחב המושגים ותרגיל התאמת חומרה לפני הוספת עודengine דומה.
- בשניהם: תאריך השקה שונה מתאריך checkpoint/release, source verification או repository creation. Stars ונתוני סקר נשארים צירים נפרדים מהמלצת לימוד. אין inference של Legacy/Discontinued מהיעדר עדכון.
- הצעות ללא אישור אינן applied. כל שינויי התוכן והמחזור חיים דורשים אישור ספציפי לדוח/IDs, ללא שינויDB/קטלוג כעת.

## מגבלות
לא בוצעו התקנה, API calls למודלים, benchmark, בדיקת מחשב/GPU, בחינת חשבון/חיוב או רישוי משפטי. זו ביקורת עצמאית בתוך צוותAI, לא סקר משתמשים ולא אישור צד שלישי. מקורות נפתחו ונקראו באופן נקודתי; אישוש מאותו ספק אינו עצמאות ארגונית.

## השלמת בדיקת SDKs — 2026-11-03
[Claude SDK overview](https://platform.claude.com/docs/en/cli-sdks-libraries/overview) נפתח: C# הוא client רשמי ל־Messages API, לצד Python/TypeScript ושפות נוספות; זו אינה הוכחה ל־Agent SDK native .NET. [Google libraries](https://ai.google.dev/gemini-api/docs/libraries) נפתח ומפנה ל־[Google GenAI .NET](https://googleapis.github.io/dotnet-genai/), שנפתח גם הוא ומציג Google.GenAI עבור net8.0/netstandard2.0. הספרייה תומכת ב־Developer API וב־Enterprise Agent Platform אך תכונות מסוימות תלויות mode. התיקון מרישום HTTP בלבד ל־client רשמי מוצדק, בלי להבטיח feature parity. חוסר אזכור C# בפסקת המבוא של דף Google אינו גובר על טאב C# והעמוד הייעודי. כתובת Claude C# פרטנית משוערת לא נפתחה; אין טענה הנשענת עליה.

## ביקורת סופית של שתי הטיוטות

סיום מדוד: **2026-11-03T09:41:58Z**; משך הביקורת 4 דקות ו־55 שניות. נקראו במלואם `research/runs/2026-11-03-models07-v1.md`, מזהה `models07-20261103-v1` (כולל כותרת זמן 09:41:38Z), ו־`research/runs/2026-11-03-inference08-v1.md`, מזהה `inference08-20261103-v1`. הביקורת מתייחסת לתוכן גרסאות אלו; שינוי מהותי לאחריה מחייב בדיקה מחודשת.

**מסקנה: אין התנגדות חוסמת להגשת שני הדוחות לאישור המשתמש. אין אישור לבצע או לפרסם את ההצעות.**

- **07:** כיסוי 14/14 רשומות קיימות, M07-01–M07-18 בחבילה הראשית, שלוש הוספות (Gemma, Phi, Cohere Command); 19–20 מוצעות בנפרד. הסקר מוצג כנתוני ספקים עם מכנה ושנת מדידה, ורישיונות מוצמדים ל־checkpoint. SDKs רשמיים מובחנים מ־HTTP גנרי ומ־Agent SDK. הורדת עדיפות Llama/Qwen/Hugging Face מוצעת כהחלטה פדגוגית וחפיפה, בנפרד מתיקון עובדתי; יש לאפשר אישור נפרד שלה. התוספות אינן מכפילות את תפקיד gateway/engine של 08.
- **08:** כיסוי 4/4 רשומות קיימות, I08-01–I08-09 בחבילה הראשית, ארבע הוספות (יסודות inference, LiteLLM, ONNX Runtime GenAI, SGLang); 10–13 אופציונליות/נדחות. יש הבחנה בין desktop, runtime, serving, gateway ו־in-process .NET. מגבלות cloud דרך localhost, authentication, Preview, חומרה ורישוי מפוצל מופיעות; אין טענת throughput גורפת או סיווג lifecycle ללא מקור.
- **גבולות האימות:** מקורות GitHub נאספו מרכזית, ללא חיפושים כפולים של המבקר; release tag חריג אינו מוצג כהבטחת יציבות. המקור הרשמי ל־Foundry SDK overview נפתח ותומך במטריצת SDK/endpoint. קישור המקור הפרטני לפרישת Azure AI Inference beta SDK ב־26/08/2026 לא נפתח עצמאית אצל המבקר, אף שהחוקר מדווח שקרא אותו; זו מגבלת אישוש עצמאית נקודתית, ולא ממצא הסותר את הטענה. אין לטעון שכל תאריך בשני הדוחות אומת פעמיים.

מקורות משלימים שנפתחו בביקורת: [LM Studio authentication](https://lmstudio.ai/docs/developer/core/authentication), [LiteLLM LICENSE](https://github.com/BerriAI/litellm/blob/main/LICENSE), [vLLM security](https://docs.vllm.ai/en/latest/usage/security/), [Cohere Command A model card](https://huggingface.co/CohereLabs/c4ai-command-a-03-2025), [AWS SDK for .NET v4 Bedrock examples](https://docs.aws.amazon.com/sdk-for-net/v4/developer-guide/csharp_bedrock-runtime_code_examples.html), [Foundry SDK overview](https://learn.microsoft.com/en-us/azure/foundry/how-to/develop/sdk-overview). הפתיחה הנקודתית של דף אבטחת vLLM זיהתה סעיפי authentication limits; הסוכן הראשי אימת את תוכנם בנוסף.

היעילות טובה: שני חוקרים עבדו במקביל, המבקר בדק צירים משותפים בסיכון גבוה במקום לחזור על מלוא איסוף הנתונים, ומדדי GitHub נאספו פעם אחת. לא נאספו נתוני token usage זמינים למבקר; אין אומדן מומצא. לא נעשו שינויי קטלוג, קוד, DB, Commit, Push או Deployment במסגרת הביקורת.
