import { execFileSync } from 'node:child_process'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const VIRTUAL = 'virtual:changelog'
const RESOLVED = `\0${VIRTUAL}`

/** How far back /changelog reaches. Also a size budget: the list ships in the
 *  bundle, and Netlify clones shallowly, so asking for everything gets
 *  neither. Thirty entries is roughly a year of this repo. */
const DEPTH = 30

/** Unit separator — `git log` field delimiter, safe inside a commit subject. */
const US = ''

/**
 * Hands the site's own git history to the app as a module.
 *
 * /changelog is generated, never maintained — the commit messages in this repo
 * already read as release notes, so the page is written by the act of working
 * on it. Reading git here rather than in a prebuild script keeps the history
 * out of the working tree: nothing to commit, nothing to fall out of date.
 *
 * Both the client and SSR builds load this module, and both run against the
 * same commit, so the prerendered markup and the hydrated markup agree.
 */
function changelog(): Plugin {
  return {
    name: 'changelog',
    resolveId: (id) => (id === VIRTUAL ? RESOLVED : null),
    load(id) {
      if (id !== RESOLVED) return null

      let commits: { sha: string; date: string; subject: string }[] = []
      try {
        const out = execFileSync(
          'git',
          ['log', `-n${DEPTH}`, '--no-merges', `--format=%h%x1f%cs%x1f%s`],
          { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
        )
        commits = out
          .split('\n')
          .filter(Boolean)
          .map((line) => {
            const [sha, date, subject] = line.split(US)
            return { sha, date, subject }
          })
      } catch {
        // No git, or a clone too shallow to read: the page renders its empty
        // state rather than failing the build.
      }

      return `export const COMMITS = ${JSON.stringify(commits)}`
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), changelog()],
  build: {
    // Keep every asset a real file. The brand mark sits just under Vite's
    // 4 KB inline threshold, and base64-ing it put the same bytes in both the
    // prerendered HTML of all five routes and the JS bundle — more weight than
    // the one immutably-cached request it saved.
    assetsInlineLimit: 0,
  },
})
