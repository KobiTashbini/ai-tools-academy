export type Category = Readonly<{ id: string; name: string; description: string }>;

export type KnowledgeEntry = Readonly<{
  id: string;
  slug: string;
  name: string;
  kind: "protocol" | "model" | "sdk" | "framework" | "platform" | "concept" | "product";
  categoryIds: readonly string[];
  summary: string;
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
};
