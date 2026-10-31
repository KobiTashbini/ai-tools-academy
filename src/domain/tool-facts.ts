export type ToolFacts = Readonly<{
  description: string;
  languages: string;
  languageSources: readonly string[];
  release?: { value: string; precision: "day" | "year"; source: string; note: string };
  github: {
    status: "verified" | "not_applicable" | "unverified";
    scope: string;
    url?: string;
    stars?: number;
    starsSource?: string;
    collectedAt?: string;
    lastActivity?: { date: string; source: string; branch: string; method: "default_branch_head_commit_committer_date" };
  };
  popularity: { algorithm: string; source: string; score: number | null; reason: string; collectedAt: string };
}>;

export type SortKey = "name" | "release" | "stars" | "popularity";
export type SortDirection = "asc" | "desc";
