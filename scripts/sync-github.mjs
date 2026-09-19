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
 * downgrade. The language mix corroborates the stack claims instead.
 *
 * A last-push date is omitted for a different reason: this repo is one of the
 * repos it measured, so the sync's own commit moved the figure it had just
 * written, and the weekly job re-committed it forever on an empty diff.
 */
import { readFile, writeFile } from 'node:fs/promises';

const USER = 'Maheshwaran325';
const OUT = 'src/data/githubStats.json';

// Unauthenticated calls are rate-limited per IP, and a GitHub Actions runner
// shares its IP with everyone else on that host — so the weekly job supplies
// the workflow's own token. Running it by hand needs no token.
const token = process.env.GITHUB_TOKEN;

const response = await fetch(
  `https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`,
  {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': `${USER}-portfolio`,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  },
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

const figures = {
  user: USER,
  url: `https://github.com/${USER}`,
  publicRepos: repos.length,
  languages,
};

/**
 * Nothing is written unless a figure actually moved.
 *
 * syncedAt is the date of the last *check*, and it is not rendered anywhere.
 * Stamping it on every run would make the weekly job commit a one-line diff
 * every week whether or not GitHub had anything new to say — and since
 * /changelog is generated from the commit log, that noise would be published.
 */
const previous = await readFile(OUT, 'utf8').then(JSON.parse, () => null);
const unchanged =
  previous && JSON.stringify({ ...previous, syncedAt: undefined }) === JSON.stringify({ ...figures, syncedAt: undefined });

if (unchanged) {
  console.log(`${OUT}: unchanged (${figures.publicRepos} repos).`);
  process.exit(0);
}

const stats = { ...figures, syncedAt: new Date().toISOString().slice(0, 10) };
await writeFile(OUT, `${JSON.stringify(stats, null, 2)}\n`, 'utf8');
console.log(`${OUT}: ${stats.publicRepos} repos, ${languages.length} languages`);
