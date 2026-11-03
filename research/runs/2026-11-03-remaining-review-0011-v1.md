# ביקורת עצמאית — קטגוריות00 ו־11

מזהה **remaining-review-0011-20261103-v1**; מבקר `remaining_workflow03`, שלא חיבר את דוחות00/11. בסיס86 זהויות בקריאה בלבד מ־2026-11-03T10:51:17.466Z. הרשומות הנחקרות: llm-fundamentals rev3 משותפת00/07 ו־PyTorch rev2 ב־11. לא בוצעו כתיבות לקטלוג, קוד או SQL, התקנות או קריאותמודל. הביקורת איננה אישור לפרסום.

## קטגוריה00 — קריאה ובדיקה הושלמו

נקרא דוח `ecosystem00-20261103-v1` כולו ונבדקו E00-01–02 מול מסמך llm-fundamentals המלא. נפתחו עצמאית Google Production ML ו־Hugging Face Model Cards. המפה מציעה הבנת שכבות וגבולות דטרמיניסטיים ולא התקנת עוד מוצרים. אין רשומה חדשה שמכפילה יסודות04/08/09/10 או ספק07. E00-01 כ־concept/must_learn מוצדקת כפרק מעבר למפתח מנוסה, ומדריך00 מפנה לזהויות הקיימות.

**אין התנגדות מהותית להצגת שתי ההצעות.** checked/no change ל־llm-fundamentals rev3 מוצדק: כבר נוספו הבחנת משפחה/checkpoint/provider/endpoint והפרדת הרשאה מסכמה. אין צורך revision4 לצורך חותמת זמן בלבד. חברות00/07 חייבת להישמר אם יתוקן בעתיד. מקור Model Card מציג כרטיס תיעוד ורישוי, ולא ערובה לדיוק או היתר SDK חלופי. אין דירוג Stars לפרק מושגים או מקור לימוד.

התרגיל React→ASP.NET→SQL שומר סכומים, מלאי והרשאות בקוד; הצורך במודל אינו הנחת מוצא. הבחירה בין RAG, prompt ו־fine-tuning נשארת תלויה במשימה וב־eval, לא כלל ״RAG תמיד עדיף״. הסדר הוא המלצה פדגוגית, לא הוכחת ביצועים. מקורות: [Google Production ML](https://developers.google.com/machine-learning/crash-course/production-ml-systems), [HF Model Cards](https://huggingface.co/docs/hub/model-cards).

## קטגוריה11 — ממצאי מקור מוקדמים

| נושא | אימות/התנגדות עצמאיים | השלכה מומלצת |
|---|---|---|
| TorchSharp | README מתאר wrapper של LibTorch, לקראת1.0 עם breaking changes; אינו כל PyTorch Python. MIT אומת ב־LICENSE.txt. החל0.103 אין IntelMac, וב־.NET Framework Windows נדרשx64. | להשאיר כהעשרה ולהציג מגבלות maturity/חומרה, ללא parity גורף. [README](https://github.com/dotnet/TorchSharp), [LICENSE](https://github.com/dotnet/TorchSharp/blob/main/LICENSE.txt) |
| ML.NET | Microsoft מתעדת אימון מודלים, חיזוי וטעינתONNX/TensorFlow; זו איננה מסגרת fine-tuning כללית ל־LLMs. MIT אומת. | ערך.NET ברור למשימותML רגילות; אין לחייב TorchSharp/Python או להבטיח כיסויכלLLM. [API overview](https://learn.microsoft.com/en-us/dotnet/machine-learning/mldotnet-api), [LICENSE](https://github.com/dotnet/machinelearning/blob/main/LICENSE) |
| W&B | LICENSE של wandb/wandb הוא MIT ל־SDK. הוא אינו רישיון שירותModels או hosting. | לסמן גבולות SDK/SaaS ואי־גישתdocs; אין הבטחת self-host או enterpriseprivacy מתוךרישיוןSDK. [SDK LICENSE](https://github.com/wandb/wandb/blob/main/LICENSE) |
| TRL | הספרייה כוללתSFT/DPO/GRPO ועוד; לאכלהתאמהמחייבתRL. דף usage_stats מציין ping בכל trainer instantiation, opt-out ו־CI/offline exceptions. | להציג שלב התמחות לאחרbaseline; אימוןמקומי אינו הבטחתno-network. [TRL](https://huggingface.co/docs/trl/index), [Usage stats](https://huggingface.co/docs/trl/usage_stats) |
| PEFT | תיעוד רשמי מונה מגווןadapters/LoRA, quantization והתאמות. | LoRA היא שיטה, PEFTספרייה; רישיוןקוד אינו רישיוןמודל/dataset, ויעילותזיכרוןאינהbenchmarksלכלמשימה. [PEFT](https://huggingface.co/docs/peft/index) |
| MLflow | מסמךML מבדילtracking/registry/deployment ממסלולGenAI tracing/evals. טענתdownloadsבדף היא טענתספק. | רשומהאחתבהצלבת11/10אםמוצע; איןStarsשניכפולים אוadoptionמשוערמהשיווק. [MLflow ML](https://mlflow.org/docs/latest/ml/) |

ממצאים אלה נשלחו למחבר לפני סגירת הדוח. קריאה מלאה של טיוטת11 תתועד כאן לאחר השלמתה.

## קטגוריה11 — קריאה מלאה הושלמה

נקרא `training11-20261103-v1` כולו ונבחנו כל11 ההצעות F11-01–F11-11 מול בסיס PyTorch,86 הזהויות ומקורות עצמאיים. אין כפילות ביןHF Providers לבין ספריות Transformers/Datasets/PEFT/TRL; MLflow מוצעת בזהות אחת ב־11 עם קשר10, ולא alias חדש לכל יכולתGenAI. TorchSharp ו־ML.NET מובחנות זו מזו ומ־ONNX Runtime GenAI08.

| הצעות | מסקנת ביקורת עצמאית |
|---|---|
| F11-01–02 | יסודות must_learn ו־PyTorch enrichment הם איזון מוצדק. ידע split/leakage/eval/rollback חובה גם בלי אימון; אימון tensor-level אינו prerequisite לאפליקצייתAI. אין הצדקה למחיקה או lifecycle חדש. |
| F11-03–05 | Transformers/Datasets/PEFT ממלאות תפקידים נפרדים; should_know כהיכרות מוצדקת, ולא תרגול שלושתן לכל לומד. dataset/checkpoint/adapter/license נפרדים מהקוד. Python training אינו SDK C# מקומי, ונתיב serving/export נדרש להיבדק בנפרד. |
| F11-06 | TRL enrichment נכונה לאחר baseline ו־dataset/eval; SFT אינו בהכרחRL. ממצאtelemetry הועבר למחבר, והדוח כבר מזכיר אותו בטבלה ובתרגיל; נדרש קישור מקורUsage Stats ותיחום הנתונים לפני סגירה. |
| F11-07 | MLflow should_know מוצדקת לתיעוד ניסוי/registry, גם כשהאימוןקטן. REST אינו native C#SDK. registry אינו הרשאתפריסה או הוכחתאיכות. חפיפה10 גלויה ולא יוצרתכפילות. |
| F11-08 | W&B Models enrichment יכולה להופיע כהשוואה מותנית בלבד. רישיוןSDK MIT אומת; תנאיSaaS/אירוח/SDK.NET לא הושלמו ויש להשאיר unknown. לא לאשר בשלבזה הבטחתhosting/privacy או רכישתשירות. אין להסיקLifecycle מהפניה ל־CoreWeave. |
| F11-09–10 | TorchSharp ו־ML.NET enrichment משלימות נתיבי.NET שונים: LibTorch wrapper לעומתML שימושי. מגבלותpre1.0/חומרה/Tensor APIs מופיעות; אין parity לכלPython stack או אימוןLLMכללי. יש להתחילכלל עסקי/מודלקיים אםמספיק. |
| F11-11 | המדריך שםdataset/eval/tracking לפניtuning, מפנה08לפריסה ו־10להערכה, ואינו מחייב אתכלכלי ההתמחות. רצףנכון למפתח.NET ולגבולות המשימה. |

ל־F11-08 נשאר **תנאי אימות**, לא blocker להצגת הצעה מצומצמת: המשתמש יכול לאשר הוספת רשומת השוואה עובדתית עם המגבלות, או לדחותה עד גישהלתנאי השירות. יתרההצעות מתאימות להצגה לאישור עם אי־ודאותlaunch/latest שמסומנת. אין מסקנת יציבות גורפת ממספרגרסה או מקורGitHub API שנחסם; רישיוןהקוד אינו רישיוןמודל/נתונים.

### מסקנת ביקורת00/11
שתי הצעות00 ואחת־עשרה הצעות11 מתאימות להצגה למשתמש כהמלצות, ולא כאישור לפרסום. לא נמצאה חסימה לשינויי ליבה או הצדקה להמציא תאריכים/מדדים. ממצאיTorchSharp ו־TRL הועברו לפני סגירה; W&B מותנית ומסומנת. אין ריצתאימון, benchmark עברית/latency/זיכרון או פיתוחקוד במסגרת הביקורת. הליבה היא ידע והחלטות, לאחובתאימון או רכישתמערכת. כלההצעות pending_review/approval:null עד אישורהמשתמש.
