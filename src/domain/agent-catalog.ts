export type AgentMetric = {
  slug: string;
  description: string;
  languages: string[];
  learningReason?: string;
  communityInterest?: { score: number; stars: number; forks: number; maxStars: number; maxForks: number; method: string; source: string; repository: string; collectedAt: string; cohort: string; cohortLabel?: string };
  popularity?: {
    score: number;
    analyzedAt: string;
    source: string;
    package: string;
    repository: string;
    identitySource: string;
    methodSource: string;
    historical: true;
  };
  sourceRank?: { score: number; source: string; package: string; repository: string; platform: string; updatedAt: string | null };
  collectedAt: string;
};
