/**
 * Lighthouse budgets for CI.
 *
 * The site scores 100/100/100/100 on PageSpeed for mobile and desktop alike,
 * and the last dozen commits were spent getting it there — inlining the
 * stylesheet, subsetting and preloading the fonts, killing the layout shift
 * the webfont swap caused. None of that was protected by anything. This is
 * what protects it.
 *
 * Run locally with `npm run lighthouse`; CI runs it for mobile and again for
 * desktop (`--collect.settings.preset=desktop`).
 *
 * .cjs rather than .json because package.json sets "type": "module", so a
 * plain .js here would be parsed as ESM and fail to load.
 */

/** Every published route. Trailing slashes matter: the client router reads
 *  window.location.pathname, and `/index.html` does not normalise to `/`, so
 *  requesting the file directly hydrates the 404 over the prerendered page
 *  and logs a React hydration error. Audit the URLs Netlify actually serves. */
const URLS = [
  '/',
  '/work/',
  '/work/institutional-platform/',
  '/work/guide2profit/',
  '/work/land2build/',
  '/resume/',
  '/changelog/',
]

module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: URLS.map((path) => `http://localhost${path}`),
      // Three runs, median taken: enough to shake out a single slow run
      // without turning CI into a five-minute job.
      numberOfRuns: 3,
    },

    assert: {
      aggregationMethod: 'median-run',
      assertions: {
        /* ---- deterministic, so held at exactly 100 ----------------------
           These are the scores that regress silently and invisibly: a new
           page with a contrast slip, a missing meta description, a stray
           console error. Nothing about the machine affects them, so there is
           no reason to accept 99. */
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],

        /* ---- performance ------------------------------------------------
           The composite score is a function of measured timings, so it moves
           with whatever hardware the runner happens to give us: the same
           build scores 100 on PageSpeed and 99 locally purely on a tenth of
           a second of LCP. Gating on 1.0 would fail honest builds, and a
           gate that cries wolf gets ignored — which costs more than the
           point it was protecting.

           So the score carries a floor that still catches a real collapse,
           and everything underneath it that *is* machine-independent is
           pinned exactly, below. Raise this to 1 if the runner turns out to
           be steadier than expected. */
        'categories:performance': ['error', { minScore: 0.99 }],

        /* ---- the parts of performance that are facts, not timings ------- */
        // Zero, and it must stay zero: the whole point of font-display:
        // optional and the metric-matched fallback face.
        'cumulative-layout-shift': ['error', { maxNumericValue: 0 }],
        'total-blocking-time': ['error', { maxNumericValue: 150 }],
        // The stylesheet is inlined and the bundle is a module: nothing
        // should ever block the first paint again.
        'render-blocking-resources': ['error', { minScore: 1 }],
        'errors-in-console': ['error', { minScore: 1 }],
        'unused-css-rules': ['error', { minScore: 1 }],
        'modern-image-formats': ['error', { minScore: 1 }],
        'uses-responsive-images': ['error', { minScore: 1 }],
        'uses-text-compression': ['error', { minScore: 1 }],
        'legacy-javascript': ['error', { minScore: 1 }],

        /* ---- weight, with enough headroom for ordinary growth -----------
           Transferred bytes. Today: ~94 KB of script, ~57 KB of fonts,
           ~187 KB in total on the heaviest page. A dependency that doubles
           the bundle should have to argue for itself. */
        'resource-summary:script:size': ['error', { maxNumericValue: 130_000 }],
        'resource-summary:font:size': ['error', { maxNumericValue: 70_000 }],
        'resource-summary:total:size': ['error', { maxNumericValue: 260_000 }],

        // Third-party requests are the usual way a fast site stops being one,
        // and this site deliberately has none.
        'resource-summary:third-party:count': ['error', { maxNumericValue: 0 }],
      },
    },

    upload: {
      target: 'filesystem',
      outputDir: './.lighthouseci',
    },
  },
}
