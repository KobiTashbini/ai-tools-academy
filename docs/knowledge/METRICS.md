# מדדי טבלת הכלים

## עדכון מודלים והסקה — 2026-10-31
נאספו מחדש Stars, Forks ו־Commit בראש ענף ברירת המחדל עבור Ollama; נוספו llama.cpp ו־vLLM, 19 צילומי מאגר בסך הכול. `content/inference-community-interest.json` שומר מדגם קבוע ונפרד של שלושת מנועי ההסקה: `50 × Stars / maxStars + 50 × Forks / maxForks`. זהו GitHub Interest מקומי מצטבר, לא פופולריות כללית, נתח שוק, מגמה או איכות. LM Studio אינו מיוצג במאגר היישום המלא, ולכן לא משתמשים במאגר SDK או משוב במקומו. למשפחות מודלים ולפלטפורמות ללא מאגר מייצג אין ציון GitHub כזה.

מדגם קטגוריה 02 ממשיך להיות שבעת המאגרים המקוריים; אין השוואה בין שני בסיסי המדידה. קובץ ההסקה מאומת מול זהות המאגר, Stars, Forks ותאריך האיסוף בצילום המצב. תקלה או חוסר בנתונים מכשילים את הקריאה לפני תצוגת ציון.

נוספו 14 תאריכי השקה לפריטים החדשים: GPT, Claude, Gemini, Llama, Qwen, Mistral, OpenRouter, Together AI, Foundry, Bedrock, Vertex AI, LM Studio, llama.cpp ו־vLLM. לכל תאריך קישור והגדרת האירוע בשדה note. תאריך GPT הוא פרסום המודל המקורי ב־2018, Foundry הוא הצגת השם Azure AI Foundry ב־2024, ו־Vertex הוא השקת הפלטפורמה ב־2021. OpenRouter ו־LM Studio בדיוק שנה בלבד; בפרק LM Studio המקור מציין מאי 2023 אך יום מדויק לא אומת. DeepSeek נשאר ללא תאריך מאומת. ב־llama.cpp אומת תאריך Commit שהמחבר סימן במפורש Initial release, ולא תאריך יצירת המאגר.

`npm run metrics:refresh` מרענן ידנית רק את נתוני שלושת מנועי ההסקה. אין אסימון, Worker או רענון בעת פתיחת האתר. כדי להציג תוצאות חדשות נדרשת בנייה חדשה; בעתיד ניתן לשקול איסוף מתוזמן עם מטמון אחרון תקין ומועד עדכון גלוי. תאריכי ההשקה הם עובדות ערוכות ולא נגזרים אוטומטית ממטא־נתוני מאגר.

## תיעוד האיסוף המקורי

נבדק ונאסף: 2026-10-31. הקבצים `content/tool-facts.json` ו־`content/github-snapshot.json` שומרים תיאורים, מקורות ותאריך איסוף. אין איסוף בזמן ריצה או Worker.

- **Stars:** צילום מצב של `stargazers_count` מתוך GitHub REST API עבור 17 מאגרים רשמיים שנבחרו. הקישור והיקף המדידה מפורשים בכל רשומה. לדוגמה, Agents SDK נמדד לפי מאגר Python בלבד, MCP לפי המפרט ו־Claude Code לפי המאגר הרשמי הציבורי שאינו קוד המקור המלא. אין חיבור כוכבים בין מאגרים.
- **עדכון אחרון:** `commit.committer.date` של Commit בראש ענף ברירת המחדל בזמן האיסוף. שמורים קישור ל־Commit ושם הענף. זה אינו תאריך Push, פעילות בכל הענפים או פרסום גרסה. הצגת יום לפי UTC.
- **השקה ציבורית ראשונה:** אומתו MCP ו־Claude Code באמצעות הכרזות Anthropic. Claude Code מסומן כ־Limited Research Preview, לא GA. יתר התאריכים: ״לא אומת״. אין שימוש ב־created_at של מאגר. המודל תומך ביום מדויק או בשנה בלבד.

## בחירת מדד פופולריות
- [OSS Compass Community Popularity v3](https://oss-compass.org/docs/docs/v3-assessment/Community%20Ecosystem%20Health%20Assessment/Community%20Vitality/): מתייחס לגידול ב־Stars וב־Forks בתקופת מדידה. חסרים נתוני היסטוריה ותקופה אחידה, ולכן לא חושב ציון; מוצג ״לא זמין״. לא יושמה נוסחה חלופית.
- [OpenSSF Criticality Score](https://openssf.org/projects/criticality-score/): מודד השפעה וחשיבות באקוסיסטם; לא הוצג כפופולריות.
- [npms popularity](https://github.com/npms-io/npms-analyzer/blob/master/lib/analyze/evaluate/popularity.js): מתייחס לחבילות npm, עם הורדות, תאוצה ותלויות. אין מיפוי חבילות ונתונים בני השוואה לכל הפריטים, לכן לא שולב.
- [Libraries.io SourceRank](https://github.com/librariesio/libraries.io/blob/main/app/helpers/sourcerank_helper.rb): כולל גם רישוי, גרסאות ותחזוקה; אינו ציון פופולריות נפרד מתאים לבקשה. לא שולב.

מיון חסרים משאיר אותם תמיד בסוף. מיון בעמודה ללא נתונים מושבת עם הסבר. מספר כוכבים אינו ציון פופולריות כולל או ציון איכות. עובדות שלא אומתו נשארות חסרות; אין להסיק מאפס היעדר נתונים.
