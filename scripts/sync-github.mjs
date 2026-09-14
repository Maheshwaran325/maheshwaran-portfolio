/**
 * Refreshes the public GitHub figures in src/data/githubStats.json.
 *
 * Deliberately NOT part of `npm run build`. Builds stay hermetic: no network
 * call that can rate-limit or fail mid-deploy, and the committed JSON is the
 * single source the page renders from. Run it by hand when you want the
 * numbers refreshed:
 *
 *   npm run sync:github
 *
 * Stars and forks are omitted on purpose. They measure other people's
 * attention, not the work, and next to "₹43.4 Cr processed" they read as a
 * downgrade. Language mix and activity corroborate the stack claims instead.
 */
import { writeFile } from 'node:fs/promises';

const USER = 'Maheshwaran325';
const OUT = 'src/data/githubStats.json';

const response = await fetch(
  `https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`,
  { headers: { Accept: 'application/vnd.github+json', 'User-Agent': `${USER}-portfolio` } },
);

if (!response.ok) {
  console.error(`GitHub API returned ${response.status}. Keeping the existing ${OUT}.`);
  process.exit(1);
}

const repos = (await response.json()).filter((repo) => !repo.fork && !repo.archived);

/** Repos per primary language, most-used first. */
const byLanguage = repos.reduce((acc, repo) => {
  if (repo.language) acc[repo.language] = (acc[repo.language] ?? 0) + 1;
  return acc;
}, {});

const languages = Object.entries(byLanguage)
  .sort((a, b) => b[1] - a[1])
  .map(([name, count]) => ({ name, count }));

const latestPush = repos
  .map((repo) => repo.pushed_at)
  .filter(Boolean)
  .sort()
  .at(-1);

const stats = {
  user: USER,
  url: `https://github.com/${USER}`,
  publicRepos: repos.length,
  languages,
  lastPush: latestPush?.slice(0, 10) ?? null,
  syncedAt: new Date().toISOString().slice(0, 10),
};

await writeFile(OUT, `${JSON.stringify(stats, null, 2)}\n`, 'utf8');
console.log(
  `${OUT}: ${stats.publicRepos} repos, ${languages.length} languages, last push ${stats.lastPush}`,
);
