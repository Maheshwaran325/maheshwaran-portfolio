/**
 * The published surface of the site, written out rather than discovered.
 *
 * Deliberately a hand-maintained list: it is the expectation the build is
 * checked against. tests/publish.spec.ts asserts that dist/ and the sitemap
 * contain exactly these routes and nothing else, so adding a page without
 * adding it here fails, and so does silently dropping one.
 */
export interface Route {
  /** As served, with the trailing slash Netlify answers 200 for. */
  path: string
  /** The exact <title>, which must also match App.tsx's TITLES map. */
  title: string
  /** Text that must appear in the prerendered markup — proof a crawler that
   *  runs no JavaScript still gets the page. */
  marker: string
  /** The page's single h1. */
  heading: RegExp
}

export const ROUTES: Route[] = [
  {
    path: '/',
    title: 'Maheshwaran A K — AI-Native Full-Stack Engineer',
    marker: 'Full-stack in the ordinary sense',
    heading: /AI-native\s*full-stack\s*engineer\./,
  },
  {
    path: '/work/',
    title: 'What I build — Multi-tenant systems, dashboards and LLM integration — Maheshwaran A K',
    marker: 'roles data rather than code',
    heading: /What I build/,
  },
  {
    path: '/work/institutional-platform/',
    title: 'Institutional Finance & Research Platform — Case study — Maheshwaran A K',
    marker: 'approval engine',
    heading: /Institutional Finance/,
  },
  {
    path: '/work/guide2profit/',
    title: 'Guide2Profit — Startup financial modelling — Post-mortem — Maheshwaran A K',
    marker: 'Guide2Profit',
    heading: /./,
  },
  {
    path: '/work/land2build/',
    title: 'Land2Build — Generated floor plans — Case study — Maheshwaran A K',
    marker: 'binary space partition',
    heading: /./,
  },
  {
    path: '/resume/',
    title: 'Résumé — Maheshwaran A K — AI-Native Full-Stack Engineer',
    marker: 'Bipolar Factory',
    heading: /Maheshwaran A K/,
  },
  {
    path: '/changelog/',
    title: 'Changelog — Maheshwaran A K',
    marker: 'read straight from git',
    heading: /What changed, and when\./,
  },
]

/** Files published alongside the routes that must never go missing. */
export const PUBLISHED_FILES = [
  '404.html',
  'sitemap.xml',
  'robots.txt',
  'llms.txt',
  'Maheshwaran-A-K-Resume.pdf',
  'og.png',
  'favicon.ico',
]
