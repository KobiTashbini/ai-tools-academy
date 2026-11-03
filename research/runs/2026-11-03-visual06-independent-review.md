# ביקורת עצמאית למחקר קטגוריה 06 — Visual AI Builders

מזהה: visual06-review-20261103-v1. מבקר: visual_review, סוכן נפרד מחוקרי הליבה/הארגון ומהסוכן הראשי. חלון אימות Web: 2026-11-03T08:55:00Z–2026-11-03T08:56:43Z (חלון הביקורת הראשונית). סטטוס: ביקורת מחקר בלבד; אין אישור פרסום או שינוי קטלוג.

## חומרים שנבדקו
בסיס חי visual06-baseline-2026-11-03.json (57 זהויות, rich scope של Dify revision2); מדידות visual06-github-retry-2026-11-03.json; מחקר הליבה ומחקר המשלים, ותוכנית ההמלצות שהועברה למבקר. דוח הארגון והדוח המשולב נבדקים בנפרד לאחר השלמתם; אין לייחס ביקורת זו לגרסה סופית לפני שמצוינת במפורש.

## התנגדויות מהותיות והכרעות
1. יש להפריד דירוג פדגוגי, שימושיות בתרחיש, ועניין GitHub. אין benchmark או סקר אימוץ משותף ולכן אין בסיס לדירוג אוניברסלי של איכות/אימוץ. Copilot Studio יכול להיות ראשון בארגון Microsoft ובמקום אחר לא להיות הבחירה המועדפת.
2. Sim כ־should_know סביר בזכות תפקיד workflow/TypeScript/API/MCP, אך FastGPT נמדד עם 29,982 Stars מול29,980 של Sim. אין לנמק דחיית FastGPT בפופולריות נמוכה; הנימוק הוא חפיפה ונטל לימודי/תפעולי.
3. הדוח חייב לכלול OpenAI Agent Builder כמועמד שנבדק ונדחה לאימוץ חדש בגלל deprecation. התיעוד הנוכחי, לא סקירות2025, מכריע. [מדריך רשמי](https://developers.openai.com/api/docs/guides/agent-builder) ו־[Deprecations](https://developers.openai.com/api/docs/deprecations) מאשרים הודעה2026-06-03 וכיבוי מתוכנן2026-11-30; ChatKit נשאר זמין. [Migration](https://developers.openai.com/api/docs/guides/agent-builder/migrate-from-agent-builder) מתאר ייצוא TypeScript/Python ל־Agents SDK או יצירה מחדש ב־Workspace Agents; אין המרה אוטומטית או parity מובטח. נבדק לפי OpenAI Docs skill; אין צורך במפתח API למחקר תיעוד.
4. Langflow v1.0/cloud ב־2024-06-24 אינו תאריך השקה ראשונה. אין לשנות release לשם מיון בלי note מדויק על האירוע; היעדר תאריך הוא תשובה תקפה.
5. ב־Google יש להבדיל בין Gemini Enterprise Agent Platform Agent Studio לבין Gemini Enterprise CX/CX Agent Studio. [Agent Studio capabilities](https://docs.cloud.google.com/gemini-enterprise-agent-platform/agent-studio/agent-studio-capabilities) מסמן Agents/App builder כ־Preview. מודלים GA במוצר CX אינם מוכיחים GA ל־Agent Studio האמור. הוספת מידע לרשומת google-vertex-ai דורשת התאמת זהות מפורשת; אינה מתירה מיזוג כל מוצרי Google.
6. אין נתוני אימוץ השוואתיים לשירותים סגורים. unknown אינו low; Stars של כלי פיתוח/SDK אינם proxy תקף לשירות מסחרי.
7. בדיקת כפילויות כוללת את כל57 הזהויות בשאילתה הנפרדת, אך עשירות התוכן מגיעה מ־loader המסנן published. אין לטעון שנבדקו פרטי תוכן מלאים של drafts אילו היו כאלה.

## בדיקות עצמאיות לממצאים המרכזיים
- [Flowise הודעת הבעלים](https://github.com/FlowiseAI/Flowise/discussions/6727) נפתחה: freeze2026-07-29, archive2026-08-13, EOL2026-08-31. התאמה ל־archived=true במדידות. נכון לדחות מהמסלול הפעיל; אין מקור למחליפה רשמית. אין לכפות successor FK או להפוך Langflow למחליפה רשמית.
- [Langflow Security1.13.x](https://docs.langflow.org/security) נפתח: העורך מריץ Python, ול־process משותף אין בידוד tenants. צריך להציג גבול זה בהשוואת שימושיות; API keys אינם בידוד תשתיתי. זו מגבלת תכנון, לא טענה שהמוצר כולו בלתי שמיש.
- [Copilot Studio client integration](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/integrate-with-mcs) נפתח: .NET/JavaScript/Python client library קיימת, אך standard harness בלבד; GitHub Copilot harness טרם נתמך רשמית לפי הדף. אין לתאר HTTP-only או להשוות כל סוגי agents ללא סייג.
- [Dify LICENSE](https://raw.githubusercontent.com/langgenius/dify/main/LICENSE) נפתח: modified Apache2 עם תנאי multi-tenant ומיתוג frontend. שדה GitHub NOASSERTION אינו רישיון בפני עצמו. [Langflow LICENSE](https://raw.githubusercontent.com/langflow-ai/langflow/main/LICENSE) MIT.
- [Sim introduction](https://docs.sim.ai/introduction) נפתח: הליבה Apache2, יכולות Enterprise ברישיון נפרד הדורש subscription פעיל לשימוש production. [Self-hosting](https://docs.sim.ai/platform/self-hosting) מציג flags להפעלתן; הפעלה טכנית אינה הרשאה מסחרית. הצגת הסייג במחקר המשלים נכונה.
- [botpress/botpress](https://github.com/botpress/botpress) נפתח: מאגר Cloud devtools/integrations/examples ומפנה בנפרד ל־v12. אין לקרוא לו "מאגר v12" או לייחס Stars לשירות הענן. [דף v12/self-host](https://botpress.com/docs/advanced/cluster/) מבהיר sunset של v12 וגרסאות self-host חדשות; מנויים קיימים מצוינים עדיין כתמיכה. יש לשמור הבחנה זו ולא לטעון שכל לקוח קיים נותק.

## עמדה פדגוגית
אין התנגדות להוספת יסודות concept/must_learn ול־Dify מתוקנת, Langflow, Copilot Studio; Sim ו־Botpress צריכים להיות היכרות מוכוונת תרחיש ולא חובה ללמוד כל אחד. Voiceflow/FastGPT/Coze יכולים להישאר העשרה נדחית, עם סיבה גלויה. מדריך למידה שמדגים שתי חלופות ומפנה להמשך יעיל יותר מדרישה ללמוד שבע פלטפורמות.

## גבולות הביקורת
לא בוצעו התקנות, ניסויי API, בדיקת חשבון/מחיר, אבטחה מעשית, RTL או עומסים. לא נאספו מחדש metrics; נבדקה עקביות הקובץ מול תכלית המדידה. זו ביקורת עצמאית בתוך אותו צוות AI, לא בדיקת משתמשים או אישור צד שלישי. כל התוצאות הן הצעות המחייבות אישור המשתמש.

## בדיקת הדוח המשולב הסופי

נבדק במלואו הדוח **visual06-20261103-v1** בקובץ `research/runs/2026-11-03-visual-ai-builders-v1.md`, לאחר השלמת שלושת חומרי המחקר. קריאה סופית ב־2026-11-03, באותה ריצת ביקורת. קראתי גם את מחקר visual_enterprise המלא והשוויתי את ההמלצות לעובדות שתועדו.

פסק הביקורת: **אין ממצא חוסם למסירת הדוח לאישור משתמש**. הספירות עקביות: רשומה קיימת אחת ב־06, חמש חדשות = יסודות + ארבע פלטפורמות, ולכן שש בקטגוריה ו־62 בכל הקטלוג. V06-01–07 הם החבילה הראשית; Voiceflow09 נפרדת; סעיפי דחייה/הפניה אינם אישור הוספה. אין שינוי קטלוג במסגרת המחקר.

הדוח קיבל את ההסתייגויות המהותיות: הפרדה בין חשיבות/שימושיות/Stars, caveat של snapshot ו־latest endpoint, תאריכי אירועים מדויקים, EOL לשני כלים, רישיונות עם חריגים, .NET client/harness, Google CX מול Agent Platform, ועלות תפעול בלי benchmark. המקורות תומכים בגבולות הטענות המרכזיות; מעמדם כראיות מאותו ספק מפורש. נימוק Sim לעומת FastGPT הוא פדגוגי ולא פער Stars זניח. הדוח אינו מייחס נתון פופולריות נמוך לשירות סגור.

תיקון עריכתי קטן מומלץ: בשורת Botpress בטבלת הראיות לכתוב "ADK ב־TypeScript (גרסת ADK2.0.0)" במקום "ADK TypeScript2.0.0", כדי שלא יתפרש כגרסת שפת TypeScript. אין בכך שינוי בהמלצה.

נותרו מגבלות מפורשות שאינן מוסתרות: אין ניסויי מוצר או מדגם אימוץ אחיד, חלק מתאריכי ההשקה חסרים, Opal נבדק היסטורית בלבד, ורשומות ענן סמוכות מחוץ06 לא עברו audit תוכן. אישור הדוח אינו אישור קוד/ענן/פרסום אוטומטי ואינו מבטל בדיקת drift לפני החלה.
