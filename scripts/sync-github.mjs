// Daily GitHub sync: writes data/github.json from the owner's public repositories.
// Runs in .github/workflows/sync-github.yml; also works locally with `node scripts/sync-github.mjs`.
//
// Which repos are listed:
//   - public, not forks, not archived, and not this website's own repository
//   - if any repo has the topic "portfolio", only those are listed
//   - a repo with the topic "hide" is never listed
//
// The file is only rewritten when the repo list actually changes, so git history keeps one entry per real change.
import { readFile, writeFile, mkdir } from "node:fs/promises";

const user = process.env.GH_USER || "grizz6";
const self = (process.env.GITHUB_REPOSITORY || `${user}/PortfolioWebsite`).split("/")[1].toLowerCase();
const out = new URL("../data/github.json", import.meta.url);
const headers = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": `${user}-portfolio-sync` };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function fetchRepos() {
  if (process.env.REPOS_FILE) return JSON.parse(await readFile(process.env.REPOS_FILE, "utf8")); // for testing
  const all = [];
  for (let page = 1; page < 10; page++) {
    const res = await fetch(`https://api.github.com/users/${user}/repos?type=owner&sort=pushed&per_page=100&page=${page}`, { headers });
    if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
    const batch = await res.json();
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all;
}

const raw = await fetchRepos();
let repos = raw.filter((r) => !r.private && !r.fork && !r.archived && r.name.toLowerCase() !== self && !(r.topics || []).includes("hide"));
if (repos.some((r) => (r.topics || []).includes("portfolio"))) repos = repos.filter((r) => r.topics.includes("portfolio"));

const list = repos
  .map((r) => ({
    name: r.name,
    description: r.description || "",
    url: r.html_url,
    homepage: r.homepage || "",
    language: r.language || "",
    topics: (r.topics || []).filter((t) => t !== "portfolio"),
    stars: r.stargazers_count || 0,
    created: (r.created_at || "").slice(0, 10),
    pushed: (r.pushed_at || "").slice(0, 10),
  }))
  .sort((a, b) => b.pushed.localeCompare(a.pushed) || a.name.localeCompare(b.name));

let previous = null;
try { previous = JSON.parse(await readFile(out, "utf8")); } catch {}
if (previous && JSON.stringify(previous.repos) === JSON.stringify(list)) {
  console.log(`No change: ${list.length} repos.`);
} else {
  await mkdir(new URL("../data/", import.meta.url), { recursive: true });
  await writeFile(out, JSON.stringify({ user, synced: new Date().toISOString().slice(0, 10), repos: list }, null, 2) + "\n");
  console.log(`Wrote ${list.length} repos to data/github.json.`);
}
