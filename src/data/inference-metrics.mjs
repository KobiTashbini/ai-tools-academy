// This fixed cohort is independent of the original category 02 baseline.
const repositories = {ollama:"https://github.com/ollama/ollama","llama-cpp":"https://github.com/ggml-org/llama.cpp",vllm:"https://github.com/vllm-project/vllm"};
export function buildInferenceInterest(community, snapshots) {
  const fail = () => {throw Error("Invalid inference interest evidence");};
  if (community.method !== "AI TOOLS GitHub Interest v1" || community.cohort !== "category-08-three-inference-runtimes" || community.cohortLabel !== "שלושת מנועי ההסקה בקטגוריה 08" || community.entries.length !== 3 || new Set(community.entries.map(item=>item.slug)).size !== 3 || Number.isNaN(Date.parse(community.collectedAt))) fail();
  for (const item of community.entries) {
    const snapshot = snapshots[item.slug];
    if (!repositories[item.slug] || item.repository !== repositories[item.slug] || item.source !== item.repository.replace("https://github.com/","https://api.github.com/repos/") || !Number.isInteger(item.stars) || item.stars<0 || !Number.isInteger(item.forks) || item.forks<0 || snapshot?.status !== "verified" || snapshot.url !== item.repository || snapshot.starsSource !== item.source || snapshot.stars !== item.stars || snapshot.forks !== item.forks || snapshot.collectedAt !== community.collectedAt) fail();
  }
  const maxStars = Math.max(...community.entries.map(item=>item.stars));
  const maxForks = Math.max(...community.entries.map(item=>item.forks));
  if (!maxStars || !maxForks) fail();
  return Object.fromEntries(community.entries.map(item => [item.slug, {...item, score:50*item.stars/maxStars+50*item.forks/maxForks,maxStars,maxForks,method:community.method,cohort:community.cohort,cohortLabel:community.cohortLabel,collectedAt:community.collectedAt}]));
}
