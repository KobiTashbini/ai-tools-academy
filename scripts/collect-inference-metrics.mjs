// Manual public, read-only collection. No credentials or runtime calls from the app.
import { readFileSync, writeFileSync } from "node:fs";
const root = new URL("../", import.meta.url);
const read = name => JSON.parse(readFileSync(new URL(`content/${name}`, root), "utf8"));
const repositories = { ollama: "ollama/ollama", "llama-cpp": "ggml-org/llama.cpp", vllm: "vllm-project/vllm" };
const collectedAt = new Date().toISOString();
async function get(url) {
  const response = await fetch(url, { headers: { "User-Agent": "AI-TOOLS-Academy", Accept: "application/vnd.github+json" } });
  if (!response.ok) throw new Error(`Public GitHub request failed: ${response.status} ${url}`);
  return response.json();
}
const results = await Promise.allSettled(Object.entries(repositories).map(async ([slug, repository]) => {
  const source = `https://api.github.com/repos/${repository}`;
  const repo = await get(source);
  if (repo.full_name.toLowerCase() !== repository.toLowerCase() || repo.private || !Number.isInteger(repo.stargazers_count) || !Number.isInteger(repo.forks_count)) throw Error(`Unexpected repository: ${slug}`);
  const commit = await get(`${source}/commits/${encodeURIComponent(repo.default_branch)}`);
  const snapshot = { status: "verified", url: repo.html_url, scope: "המאגר הרשמי של מנוע ההסקה עצמו; Stars ו־Forks הם תשומת לב למאגר, לא מספר משתמשים או איכות המודלים.", stars: repo.stargazers_count, forks: repo.forks_count, starsSource: source,
    lastActivity: { date: commit.commit.committer.date, source: commit.html_url, branch: repo.default_branch, method: "default_branch_head_commit_committer_date" }, collectedAt };
  return { slug, snapshot, input: { slug, repository: repo.html_url, source, stars: repo.stargazers_count, forks: repo.forks_count } };
}));
const failures = results.filter(result => result.status === "rejected");
if (failures.length) throw new AggregateError(failures.map(result => result.reason), "No snapshot written: incomplete inference cohort");
const snapshots = read("github-snapshot.json");
const inputs = results.map(result => result.value);
for (const {slug, snapshot} of inputs) snapshots[slug] = snapshot;
const community = { method: "AI TOOLS GitHub Interest v1", cohort: "category-08-three-inference-runtimes", cohortLabel: "שלושת מנועי ההסקה בקטגוריה 08", collectedAt, entries: inputs.map(item => item.input) };
writeFileSync(new URL("content/github-snapshot.json", root), JSON.stringify(snapshots, null, 2) + "\n");
writeFileSync(new URL("content/inference-community-interest.json", root), JSON.stringify(community, null, 2) + "\n");
console.log(JSON.stringify({collectedAt, entries: community.entries}));
