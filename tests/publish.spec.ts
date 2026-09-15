import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, posix } from 'node:path'
import { expect, test } from '@playwright/test'
import { PUBLISHED_FILES, ROUTES } from './routes'

/**
 * What the build actually published, checked on disk.
 *
 * Netlify serves static files before it consults any redirect rule, so a route
 * exists only if its file exists. The preview server's SPA fallback hides that
 * — it answers 200 for a path that was never emitted — which is precisely why
 * these assertions read dist/ rather than making requests.
 */

const DIST = 'dist'
const SITE = 'https://maheshwaran.dev'

/** Every emitted document, as the URL path it is served at. */
function emittedRoutes(dir = DIST, prefix = '/'): string[] {
  const found: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      // Vite's fingerprinted output, not a route.
      if (entry !== 'assets') found.push(...emittedRoutes(full, posix.join(prefix, entry) + '/'))
    } else if (entry === 'index.html') {
      found.push(prefix)
    }
  }
  return found.sort()
}

test('dist contains exactly the routes the suite knows about', () => {
  expect(emittedRoutes()).toEqual(ROUTES.map((r) => r.path).sort())
})

test('the sitemap lists every route, and only real ones', () => {
  const xml = readFileSync(join(DIST, 'sitemap.xml'), 'utf8')
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc).sort()

  expect(locs).toEqual(ROUTES.map((r) => `${SITE}${r.path}`).sort())

  // Google rejects a lastmod that is not a full W3C datetime, and silently:
  // the sitemap is accepted and the date ignored.
  const lastmods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(([, d]) => d)
  expect(lastmods).toHaveLength(ROUTES.length)
  for (const lastmod of lastmods) {
    expect(lastmod).toMatch(/^\d{4}-\d{2}-\d{2}T[\d:]{8}([+-]\d{2}:\d{2}|Z)$/)
    expect(Number.isNaN(Date.parse(lastmod))).toBe(false)
  }
})

test('the 404 is published where Netlify expects it', () => {
  for (const file of PUBLISHED_FILES) {
    expect(existsSync(join(DIST, file)), `${file} is not published`).toBe(true)
  }
})

test('every internal link points at something that exists', () => {
  const broken: string[] = []

  for (const route of ROUTES) {
    const file = join(DIST, route.path, 'index.html')
    const html = readFileSync(file, 'utf8')

    for (const [, href] of html.matchAll(/href="(\/[^"#]*)"/g)) {
      // A directory URL is served by the index.html inside it; anything else
      // has to be a file sitting at that exact path.
      const target = href.endsWith('/') ? join(DIST, href, 'index.html') : join(DIST, href)
      if (!existsSync(target)) broken.push(`${route.path} → ${href}`)
    }
  }

  expect(broken).toEqual([])
})

test('nothing links to the unslashed form of a route', () => {
  // Netlify 301s /resume to /resume/. Linking the bare path spends a redirect
  // on every click and splits the URL Google sees.
  const bare = ROUTES.map((r) => r.path).filter((p) => p !== '/').map((p) => p.slice(0, -1))
  const offenders: string[] = []

  for (const route of ROUTES) {
    const html = readFileSync(join(DIST, route.path, 'index.html'), 'utf8')
    for (const path of bare) {
      if (html.includes(`href="${path}"`)) offenders.push(`${route.path} → ${path}`)
    }
  }

  expect(offenders).toEqual([])
})

test('robots and llms.txt agree with the sitemap', () => {
  const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8')
  expect(robots).toContain(`${SITE}/sitemap.xml`)

  // llms.txt is hand-written, so it drifts unless something checks it.
  const llms = readFileSync(join(DIST, 'llms.txt'), 'utf8')
  for (const route of ROUTES) {
    expect(llms, `llms.txt does not mention ${route.path}`).toContain(`${SITE}${route.path}`)
  }
})
