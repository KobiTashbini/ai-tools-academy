# ביקורת עצמאית — קטגוריות 01 ו־03

מזהה **remaining-review-0103-20261103-v1**. מבקר: remaining_agents02, שאינו מחבר דוחות 01/03. תאריך 2026-11-03. נקראו שני הדוחות במלואם ובסיס 86 הזהויות מ־2026-11-03T10:51:17.466Z. נבחנו **20/20 הצעות**: C01-01–11 ו־W03-01–09. זו ביקורת על המלצות לאישור, ולא אישור משתמש לפרסום או הוכחת התאמה ל־production.

## אימות עצמאי של טענות רגישות

| נושא | בדיקה והכרעה |
|---|---|
| Gemini CLI / Antigravity | הודעת Google מ־19/05/2026 מאשרת מעבר לקוחות פרטיים ל־Antigravity ב־18/06 והמשך מסלולי Code Assist ארגוניים ומפתחות API בתשלום. README מצמצם את ההמלצה ל־Enterprise ומזהיר לגבי Gemini4+, אך מונה גם מפתחות legacy. הדוח מבחין במסלולים ואינו מציג הפסקה גורפת. [Google](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/), [README](https://github.com/google-gemini/gemini-cli) |
| Windsurf / Devin Desktop | הודעת Cognition מ־02/06/2026 מכריזה על מעבר Windsurf ל־Devin Desktop ומבחינה בין העורך למרכז ניהול סוכנים. שמירת alias מונעת כפילות. רכישה ב־2025 אינה יום השקה. אין בסיס לסמן את כל Devin כהיסטורי בגלל רכיב Cascade ישן. [Rename](https://devin.ai/blog/windsurf-is-now-devin-desktop) |
| Codex | מקור OpenAI נפתח עצמאית: sandbox, אישור ורשת ממלאים תפקידים נפרדים. אישור פקודה אינו הוכחת נכונות. Codex Security scanner אינו אותו מוצר כמו בקרות coding agent. [Official docs](https://learn.chatgpt.com/docs/agent-approvals-security) |
| Claude Code | גבול working directory במצב Manual הוא בקשת אישור, ולא בידוד מערכת לפקודת Bash מאושרת. שימוש לאימון בחשבון צרכני תלוי setting; למסלול מסחרי תנאים וחריגי opt-in נפרדים. ההסתייגות בדוח נכונה. [Security](https://code.claude.com/docs/en/security), [Data](https://code.claude.com/docs/en/data-usage) |
| Cursor | שינוי קובצי workspace יכול להישמר מיד; auto-reload עשוי להריץ שינוי לפני סקירה. API key פרטי עדיין עובר backend; Privacy Mode אינו היעדר תעבורה. [Security](https://cursor.com/docs/agent/security), [Data](https://cursor.com/data-use) |
| Copilot / C# | המטריצה מסומנת Public Preview ומבחינה בין IDEs. מסלול Visual Studio חשוב ל־.NET; עריכת C# אינה SDK מקומי של assistant. [Matrix](https://docs.github.com/en/copilot/reference/copilot-feature-matrix), [Visual Studio](https://learn.microsoft.com/en-us/visualstudio/ide/copilot-agent-mode?view=visualstudio) |
| Antigravity Preview | Auto preset מסומן Preview ב־v2.23.0+ ותלוי חשבון. CLI והאפליקציה אינם אותה מטריצת תמיכה. אין להסיק שכל המוצר Preview או שכל מצב מבודד. [Permissions](https://antigravity.google/docs/permissions) |
| Cline | Auto Approve תלוי קטגוריות; safe command נקבע גם באמצעות דגל requires_approval של המודל ולא fixed allowlist. אין להבטיח אישור ידני לכל פעולה בכל תצורה. [Auto Approve](https://docs.cline.bot/features/auto-approve) |
| Aider / Roo | טבלת Aider מבחינה בשפות הקוד הנערך לעומת סביבת Python. מדיניות Git דורשת בדיקת auto-commit. ארכוב Roo Code ב־15/05 אומת, אך אינו ראיה להפסקת כל שירות קשור. [Languages](https://aider.chat/docs/languages.html), [Roo](https://github.com/RooCodeInc/Roo-Code) |
| Survey01 | מקור Stack Overflow2026 נפתח: Used, n=12,255. Claude65.5%, Copilot58.7%, Codex29.5% ו־Cursor25.5% תואמים. Windsurf ו־Devin אינם מסוכמים, ו־Gemini Code Assist אינו מועתק אוטומטית ל־CLI. זהו מדגם משיבי השאלה, לא נתח שוק. [Survey](https://survey.stackoverflow.co/2026/ai/data/ai-code-agent) |
| n8n license | LICENSE מחלק SUL ו־EE ומגביל שימושים מסחריים מסוימים. FAQ מ־06/10 מסביר תרחישים; אינו היתר משפטי לתרחיש לא מתואר. אין להציג MIT או OSI באופן גורף. [LICENSE](https://github.com/n8n-io/n8n/blob/master/LICENSE.md), [FAQ](https://support.n8n.io/article/can-i-use-your-license-for-my-use-case) |
| Make / Zapier | Make instant webhooks מקביליים כברירת מחדל; סדר הוא אפשרות מפורשת ואינו מניעת כפילות. Zapier Code תומכת JS/Python, לא C# runner. [Make](https://help.make.com/webhooks), [Zapier](https://help.zapier.com/hc/en-us/articles/45405528551181-Using-Code-by-Zapier) |
| Activepieces | מקור הרישוי הרשמי מבחין MIT לליבה ומסחרי ל־Enterprise/Cloud. פריסה עצמית אינה מבטיחה היעדר תעבורה לספקי pieces. [License](https://www.activepieces.com/docs/about/license) |
| Temporal | הרחבת Streams מתועדת Public Preview ובחבילת Temporalio.Extensions.WorkflowStreams ניסיונית מ־1.20.0. אין להחיל Preview על כל Temporal. הבחנת Workflow/Activity ודטרמיניזם/מניעת כפילות נכונה. [Streams](https://docs.temporal.io/develop/dotnet/workflows/workflow-streams) |
| Windmill | מדריך C# כולל Main ו־NuGet dependencies: מדובר בהרצת scripts ולא רק HTTP. הרישוי מבחין AGPL3 ו־Enterprise ואינו Apache גורף. [C#](https://www.windmill.dev/docs/getting_started/scripts_quickstart/csharp), [LICENSE](https://github.com/windmill-labs/windmill/blob/main/LICENSE) |
| Power Automate | קוד custom connector מיועד לטרנספורמציית request/response ב־.NET Standard2.0 וב־namespaces מוגבלים. הוא אינו מנוע C# חופשי. הדוח משאיר timeout לא מוסכם כלא ידוע במקום לנחש. [Custom code](https://learn.microsoft.com/en-us/connectors/custom-connectors/write-code) |

## בחינת כל ההצעות והסדר הלימודי

| הצעות | מסקנת ביקורת |
|---|---|
| C01-01–03 | שלוש הרחבות מוצדקות להרשאה, פרטיות ובידוד, ללא שינוי חשיבות מלאכותי בגלל סקר. שמירת slugs וזהויות מונעת דריסה. |
| C01-04–05 | פרק יסוד חובה ו־Copilot כ״כדאי להכיר״ ממלאים פער מתודולוגי ומסלול Visual Studio. אין דרישה ל־assistant מסוים לכל משימה. |
| C01-06–08 | Cline, Antigravity ו־Devin Desktop מכסים בחירת providers, מסלול Google ומרכז עבודה ב־IDE. החפיפה מוצהרת והמדריך מציג חלופות ולא דרישות קדם. דירוג should_know סביר כהיכרות, ללא חובת תרגול כולן. |
| C01-09–10 | Aider ו־Gemini CLI כהעשרה מתאימים להשוואת Git CLI ולמסלול ארגוני מותנה. מעבר צרכנים אינו סיבה לסיווג Legacy גורף. |
| C01-11 | יסודות → assistant אחד → diff/tests → השוואה אחת: סדר המתאים למפתח .NET/React מנוסה. SDK ב־02 ו־MCP ב־09 אינם כפילות מוצר. |
| W03-01–03 | יסודות תהליך הם חובה; n8n נשארת must_learn ו־Temporal should_know בהתאם לתפקידן. Temporal מופיעה בתיקון יחיד W03-03 עבור 02/03, ולא בשתי הצעות מתנגשות. |
| W03-04–06 | Make, Zapier ו־Activepieces מאפשרות השוואת SaaS, רישוי ואירוח. קיימת חפיפה תפקודית אך הדוח אינו מחייב לתרגל את שלושתן. |
| W03-07–08 | Windmill ו־Power Automate אינן ״אותה תמיכת C#״: scripts לעומת קוד connector מוגבל ו־RPA. סיווג platform מוסבר ואינו ממציא סוג נתון. |
| W03-09 | מסלול פשוט → validation/retries → durability לפי צורך → C#/RPA כהסתעפויות: סדר משכנע. מודל אינו מנוע ההרשאה. |

לא נמצאה כפילות זהות חדשה מול86 הזהויות. GitHub Copilot שונה מ־GitHub MCP Server; Power Automate שונה מ־Copilot Studio06; Composio09 נותרת קישור ולא רשומה נוספת ב־03. IDE, מסגרת סוכנים, מנוע תהליכים ופלטפורמת connectors הם תפקידים שיכולים להשלים זה את זה.

## מגבלות וגבול אישור

האיסוף המרכזי של GitHub נחסם ב־403 עבור 01/03. לא הוחלף במדידות HTML מעוגלות ולא בוצעו איסופי מדדים כפולים. תאריכי הבסיס נשמרים; נתון חדש נשאר חסר ולא0. אין benchmark או POC לעברית, latency, עלות, הרשאות או פרטיות בפועל. מקור ספק מאשר טענת תיעוד צרה, לא איכות או SLA.

המלצת ליבה01: C01-01–05 ו־C01-11. יתר המוצרים מתאימים לאישור כהשוואה או העשרה. ליבה03: W03-01–03 ו־W03-09; יתר הפלטפורמות להשוואה והתמחות. אין המלצה לדחות תיקון עובדתי מסוים או לשנות חשיבות קיימת בניגוד לדוחות. **אין חסימה להצגת שני הדוחות למשתמש כהמלצות; אין זה אישור לפרסום.**

לא שונו קטלוג, SQL, קוד, מדיניות או סודות; נכתבו רק ביקורת וראיות תחת research. כל ההצעות נשארות pending_review/approval:null עד החלטה מפורשת.
