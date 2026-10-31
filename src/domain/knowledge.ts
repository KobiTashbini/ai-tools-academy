export type Category = Readonly<{ id: string; name: string; description: string }>;

export type KnowledgeEntry = Readonly<{
  id: string;
  slug: string;
  addedAt: string;
  addedAtBasis: "historical_backfill" | "approved_proposal";
  discoveredAt?: string;
  approvedAt?: string;
  approvalReference?: string;
  name: string;
  kind: "protocol" | "model" | "sdk" | "framework" | "platform" | "concept" | "product" | "database" | "runtime" | "orchestration_engine";
  categoryIds: readonly string[];
  summary: string;
  learningPriority?: "must_learn" | "should_know" | "enrichment";
  prerequisites?: string;
  relatedSlugs?: readonly string[];
  sections: readonly { title: string; text: string }[];
  example: string;
  exercise: string;
  languageSupportNote: string;
  alternativesNote: string;
  publicationStatus: "draft" | "in_review" | "published" | "archived";
  verificationStatus: "unverified" | "verified" | "needs_review";
  verifiedAt: string | null;
  revision: number;
  revisionNote: string;
  sources: readonly { title: string; url: string; checkedAt: string; supports: string }[];
}>;

export const kindLabels: Record<KnowledgeEntry["kind"], string> = {
  protocol: "פרוטוקול", model: "מודל", sdk: "ערכת פיתוח", framework: "מסגרת עבודה",
  platform: "פלטפורמה", concept: "מושג", product: "מוצר",
  database: "מסד נתונים וקטורי", runtime: "סביבת הרצת מודלים", orchestration_engine: "מנוע אורקסטרציה",
};

export const priorityLabels = {
  must_learn: "חובה ללמוד",
  should_know: "כדאי להכיר",
  enrichment: "העשרה בהמשך",
};
