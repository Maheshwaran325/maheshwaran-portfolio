import { expect, test } from '@playwright/test'
import { ROUTES } from './routes'

/**
 * The contract this whole build exists to keep.
 *
 * GPTBot, ClaudeBot and PerplexityBot execute no JavaScript, so a client-only
 * render hands them `<div id="root"></div>` and nothing else. Every assertion
 * below is made against the raw HTTP response — no browser, no hydration —
 * which is exactly what those crawlers see.
 */

/** The document as a crawler receives it: one request, no JavaScript. */
async function fetchHtml(request: import('@playwright/test').APIRequestContext, path: string) {
  const response = await request.get(path)
  expect(response.status(), `${path} should be served directly`).toBe(200)
  return response.text()
}

const rootOf = (html: string): string => {
  const open = html.indexOf('<div id="root">')
  expect(open, 'shell has no #root').toBeGreaterThan(-1)
  return html.slice(open, html.indexOf('<script type="module"', open))
}

for (const route of ROUTES) {
  test.describe(route.path, () => {
    test('is prerendered, not an empty root', async ({ request }) => {
      const root = rootOf(await fetchHtml(request, route.path))

      // An unhydrated root is ~30 bytes. Anything real is orders of magnitude
      // bigger; the threshold only has to tell "rendered" from "not".
      expect(root.length).toBeGreaterThan(2000)
      expect(root).toContain(route.marker)
    })

    test('carries its own metadata', async ({ request }) => {
      const html = await fetchHtml(request, route.path)
      const site = 'https://maheshwaran.dev'
      const url = `${site}${route.path}`

      expect(html).toContain(`<title>${route.title}</title>`)
      expect(html).toMatch(new RegExp(`<link\\s+rel="canonical"\\s+href="${url}"`))
      expect(html).toMatch(new RegExp(`<meta\\s+property="og:url"\\s+content="${url}"`))

      // A description that fell back to the homepage's is the failure mode
      // worth catching: it means the override silently did not apply.
      // The shell wraps long meta tags across lines, so match on whitespace.
      const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/)?.[1]
      expect(description, 'description is missing').toBeTruthy()
      expect(description!.length).toBeGreaterThan(50)

      for (const tag of ['og:title', 'og:description', 'og:image', 'twitter:image']) {
        expect(html, `${tag} missing`).toContain(tag)
      }
    })

    test('has valid structured data naming the same URL', async ({ request }) => {
      const html = await fetchHtml(request, route.path)
      const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      expect(blocks.length, 'no JSON-LD').toBeGreaterThan(0)

      const graph = blocks.flatMap(([, json]) => {
        // Throws, and fails the test, if the build emitted invalid JSON.
        const parsed = JSON.parse(json) as { '@graph'?: unknown[] }
        return parsed['@graph'] ?? [parsed]
      }) as { '@type': string; url?: string }[]

      expect(graph.some((node) => node.url === `https://maheshwaran.dev${route.path}`)).toBe(true)
    })

    test('title survives hydration unchanged', async ({ page }) => {
      // The prerendered title and the one App.tsx sets on mount used to differ,
      // so the tab visibly changed the moment the bundle ran.
      await page.goto(route.path)
      await expect(page).toHaveTitle(route.title)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('h1')).toHaveText(route.heading)
    })
  })
}

test('the 404 is a real page that refuses to be indexed', async ({ request }) => {
  const html = await fetchHtml(request, '/404.html')

  expect(html).toContain('<title>Page not found — Maheshwaran A K</title>')
  expect(html).toContain('<meta name="robots" content="noindex" />')
  // Claiming a canonical URL would invite Google to index it anyway.
  expect(html).not.toContain('rel="canonical"')
  expect(rootOf(html)).toContain('doesn')
})

test('no route ships a render-blocking stylesheet', async ({ request }) => {
  // The build inlines the CSS and deletes the file; a stylesheet link
  // reappearing means that step silently stopped working.
  for (const route of ROUTES) {
    const html = await fetchHtml(request, route.path)
    expect(html, `${route.path} links a stylesheet`).not.toMatch(/<link[^>]+rel="stylesheet"/)
    expect(html, `${route.path} has no inlined CSS`).toContain('<style>')
    expect(html, `${route.path} does not preload its fonts`).toMatch(
      /<link rel="preload"[^>]+as="font"/,
    )
  }
})
