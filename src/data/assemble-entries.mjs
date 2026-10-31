// Batch metadata records the date on which this set of official sources was reviewed.
export function assembleEntries(initialEntries, lessonData) {
  return [...initialEntries, ...lessonData.entries.map(entry => ({
    ...entry,
    id: entry.slug,
    learningPriority: entry.priority,
    publicationStatus: lessonData.publicationStatus,
    verificationStatus: lessonData.verificationStatus,
    verifiedAt: lessonData.checkedAt,
    revision: lessonData.revision,
    revisionNote: "פרק לימוד ראשון. האימות מתייחס להגדרת המוצר וליכולות המתוארות במקורות; מחירים, גרסאות חבילות וביצועים לא נבדקו. שיקולי התכנון והתרגילים הם תוכן לימודי שלנו.",
    sources: [entry.source, ...(entry.extraSources ?? [])].map(source => ({ ...source, checkedAt: lessonData.checkedAt })),
  }))];
}
