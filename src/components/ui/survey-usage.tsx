import type { AgentMetric } from '@/domain/agent-catalog';
import { formatDate } from '@/data/tool-facts.mjs';

export function SurveyUsage({metric}: {metric: AgentMetric}) {
  const usage = metric.surveyUsage;
  if (!usage) return <span aria-label="אין נתון שימוש בסקר">—</span>;
  return <a className="text-link survey-usage-value" href={usage.source}
    title={`${usage.sourceName} ${usage.year} · ${usage.provider} · שימוש בספק, לא בגרסת מודל מסוימת`}>
    <bdi dir="ltr">{usage.percent.toFixed(1)}%</bdi><small><bdi>{usage.year}</bdi></small>
  </a>;
}

export function SurveyUsageDetails({metric}: {metric: AgentMetric}) {
  const usage = metric.surveyUsage;
  if (!usage) return null;
  return <section className="survey-usage-detail"><h3>שימוש מפתחים לפי סקר</h3>
    <p><SurveyUsage metric={metric}/> · ספק בסקר: <bdi>{usage.provider}</bdi> · <bdi>{usage.respondentCount.toLocaleString('en-US')}</bdi> מתוך <bdi>{usage.sampleSize.toLocaleString('en-US')}</bdi> משיבים לשאלה (<bdi>{usage.population}</bdi>).
      דיווח על שימוש לעבודה בשנה האחרונה, עם בחירה מרובה. שיעור בקרב משיבי השאלה, לא בכלל המפתחים, לא נתח שוק ולא מדד פופולריות מחושב.</p>
    <p><a href={usage.source}><bdi>{usage.sourceName} {usage.year}</bdi></a> · <bdi>Stack Exchange Inc.</bdi> · <a href={usage.licenseUrl}><bdi>{usage.licenseName}</bdi></a> · אומת ב־<bdi>{formatDate(usage.verifiedAt)}</bdi></p>
  </section>;
}
