# פיילוט קטגוריה 02

היקף: שבעת הפריטים הקיימים ב־Agent Frameworks & Orchestration בלבד. יתר הקטגוריות נשארות ברכיב הישן. ארבע עמודות כברירת מחדל: שם, תפקיד, שפות ופופולריות. נתוני המאגר ופרטי התמיכה נשמרים בהרחבת השורה; Stars, השקה, פעילות ו־SourceRank ניתנים להוספה כעמודות.

## המדד המקומי שאושר
בעקבות אישור המשתמש לחישוב עצמאי, מוצג **AI TOOLS GitHub Interest v1** בסולם 0–100:

`50 × Stars / maxStars + 50 × Forks / maxForks`

זהו אומדן תשומת לב מצטברת לשבעת המאגרים, עם משקל שווה לשני אותות. המקסימום מחושב מאותו צילום מצב ומאותם שבעה מאגרים; אינו מתחלף עם המיון או בחירת עמודות. המספר הוא בחירה מקומית מפורשת, לא מדד רשמי של ספק. יתרון מובנה למאגרים ותיקים ורחבים; אין כאן משתמשים פעילים, איכות, אבטחה או מדידת צמיחה. אין להשוותו לציונים בקטגוריות אחרות. המאגרים נבחרו כפי שהוגדרו בצילום המצב הקודם, לרבות מאגר Python של Agents SDK ושרת Temporal.

הקלטים, מקור GitHub API, תאריך האיסוף והנוסחה נשמרים ב־`content/category-02-community-interest.json`. הציון מחושב מקומית בבנייה, ללא קריאות API בדפדפן.

## מה נבדק לפני החישוב המקומי
- [OSS Compass API](https://github.com/oss-compass/compass-web-service/blob/main/app/api/openapi/v3/community_health/community_vitality/community_popularity.rb) אכן מחזיר `score` דרך `POST /api/v3/community_popularity/model_data`; ניסיון הקריאה החזיר 401 ונדרש token. לא נוצר חשבון או מפתח. נבדק גם המימוש המקורי; נתוני התקופה והנרמול הדרושים לא זמינים בצילום המצב המקומי, ולכן לא שוחזרה נוסחה בשם Compass.
- [npms Popularity](https://github.com/npms-io/npms-analyzer/blob/master/lib/scoring/score.js): נמצא ערך אמיתי `0.10084060588298586` עבור `@temporalio/client`, שחושב ב־17/12/2022. הוא מוצג בהרחבה בלבד כארכיון של חבילת TypeScript; אינו משקף את כלל Temporal כיום. חבילות LangChain, LangGraph ו־Agents שנבדקו לא נמצאו ב־npms.
- [Libraries.io SourceRank](https://github.com/librariesio/libraries.io/blob/main/app/helpers/sourcerank_helper.rb): נאספו ציונים משלוש חבילות PyPI שמופו למאגרים הרשמיים: LangChain, Pydantic AI ו־Microsoft Agent Framework. המדד מוצג בנפרד ואינו פופולריות טהורה. מועד החישוב אינו מפורסם; מוצג מועד האיסוף בלבד. חלק מהבקשות הוחזרו עם Retry later, ולא הומצאו ערכים חלופיים.
- [OpenSSF Criticality](https://github.com/ossf/criticality_score): מדד חשיבות נפרד. המקור מדווח שהרצת הנתונים הציבורית האחרונה הושלמה ביולי 2025; לא נוסף לפיילוט מדד חשיבות ולא הומר לפופולריות.

הנתונים החלופיים ותוצאות הבדיקה המצומצמת נשמרים ב־`content/category-02-metric-snapshot.json`. אף מדד חיצוני לא מוזג למדד המקומי.

## עדכון תצוגה — 31/10/2026
ברירת המחדל הורחבה לשש עמודות לפי בקשת המשתמש: הסוג מתחת לשם, יציאה ראשונית ו־Stars/GitHub גלויים. פעילות ו־SourceRank לבחירה.
מקורות השקה: [OpenAI Agents SDK — 11/03/2025](https://openai.com/index/new-tools-for-building-agents/), [Microsoft Agent Framework Preview — 01/10/2025](https://devblogs.microsoft.com/dotnet/introducing-microsoft-agent-framework-preview/), [LangGraph — 2024](https://www.langchain.com/blog/langgraph). ב־LangGraph ההכרזה מציינת אזכור קודם, לכן נשמרה שנה בלבד. יתר ארבעת התאריכים לא אומתו. נבדק 31/10/2026.
בדיקות: TypeScript, 6 בדיקות ממוקדות ו־build עברו. דפדפן: שש עמודות ללא גלילה בדסקטופ 1440px; מיון Stars; נייד 390px ללא גלישת עמוד.
