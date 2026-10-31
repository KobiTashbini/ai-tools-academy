# מדדי טבלת הכלים

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
