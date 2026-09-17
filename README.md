# maheshwaran-portfolio

Personal portfolio for **Maheshwaran A K** — AI-native full-stack engineer.

React 19 + TypeScript + Vite. No UI framework; the design system lives in `src/index.css`.

## Design

"Engineering log" — near-black neutral ground, a single signal colour (`--signal: #ccff3d`),
mono type for structure (labels, metadata, stack lines) and a tight grotesk for display.
Left-aligned and hairline-ruled rather than card-based. All text passes WCAG AA on the
background (lowest ratio is 4.66:1).

## Structure

```
src/
  index.css              design tokens + every component style (cascade layers)
  data/portfolioData.ts  single source of truth for the homepage and the résumé
  data/workIndexData.ts  /work/ — the capability groups the case studies hang off
  hooks/
    useReveal.ts         scroll-in reveal for .rise elements
    useActiveSection.ts  nav highlighting
    usePrefetch.ts       warms a route's HTML on hover or focus
  components/            Nav, Hero, Metrics, Work, Projects, Stack, Credentials, Faq, Contact
  pages/                 WorkIndex, CaseStudy, Guide2Profit, Land2Build, Resume, Changelog, NotFound
  assets/fonts/          self-hosted subsets, built by scripts/build-fonts.sh
  assets/avatar*.webp    hero portrait srcset, built by scripts/build-images.py
public/
  Maheshwaran-A-K-Resume.pdf
  og.png                 1200x630 social card; its figure is restamped by build-images.py
  portrait.webp          referenced by the Person JSON-LD
  favicon.ico, favicon-96.png, apple-touch-icon.png
tests/                   Playwright suite; routes.ts is the list of published routes
lighthouserc.cjs         the performance, a11y, SEO and byte budgets CI enforces
.github/workflows/       CI on every push; the GitHub figures resync weekly
```

`/work/` is an index of *capabilities*, not of projects. It exists because the URL did:
`/work/land2build/` was reachable while `/work/` answered 404. Filling it with a list of
project names would have been the obvious move and the less useful one — nobody searches
for "Land2Build", they search for someone who can integrate an LLM. So each group leads
with the problem and who has it, and treats the case studies as the evidence. Every figure
on it also appears on the study it points at, deliberately: a claim that lives on exactly
one page reads as unverified, to a reader and to a model.

Three things are generated rather than written:

- **`/resume`** renders from `portfolioData.ts`, so the page and the PDF cannot drift.
  It is laid out to print — `@media print` in `index.css` swaps the tokens to ink on
  white and drops the chrome.
- **`/changelog`** is the repository's own `git log`, read at build time by the
  `changelog` plugin in `vite.config.ts` and handed to the app as `virtual:changelog`.
  Writing a commit message is writing the entry; there is nothing to maintain.
- **The FAQ** is authored once in `portfolioData.ts` and published three ways: rendered
  on the homepage, as `FAQPage` structured data, and as text in `llms.txt`, where
  `emit-route-html.mjs` fills the `<!-- FAQ -->` marker. It exists because an AI
  assistant answering "who can build X" quotes a question-and-answer pair far more
  readily than it infers one from prose — so the answers are written to survive being
  lifted out of the page, each carrying its own numbers. `tests/publish.spec.ts` asserts
  the three copies still say the same thing.

**To change content, edit `src/data/portfolioData.ts` only.** Components read from it.
Highlight strings may contain `<strong>` for emphasis; they are rendered as HTML, so keep
them authored here rather than sourced from user input.

## Commands

```bash
npm run dev        # vite dev server
npm run build      # tsc -b && vite build && prerender every route
npm run preview    # serve the production build
npm run lint       # oxlint
npm test           # Playwright: builds, serves dist/, then checks it
npm run lighthouse # the budgets in lighthouserc.cjs, against dist/

# Both write committed files, so they only run when the inputs change:
./scripts/build-fonts.sh   # webfont subsets (needs uv)

# Fallback metrics, so the webfont swap does not move the page. Paste into index.css.
uv run --with fonttools python scripts/font-metrics.py

# Everything derived from the illustration: the avatar srcset, the nav mark,
# portrait.webp, the favicons, and the figure standing in og.png. Pass new
# artwork to replace it; with no argument it rebuilds from the master.
uv run --with pillow --with numpy --with scipy python scripts/build-images.py [source.png]
```

## Checks

`.github/workflows/ci.yml` runs on every push and pull request: lint, typecheck, build,
the Playwright suite, then Lighthouse for mobile and again for desktop.

The suite runs against `dist/`, never the dev server, because most of what is worth
guarding only exists after a build — the prerendered HTML, the inlined stylesheet, the
sitemap, the 404. It covers:

- every route is served as real HTML with a non-empty `#root`, which is the contract
  that makes the site readable to crawlers that run no JavaScript;
- each route's title, canonical, OG tags and JSON-LD, and that the title the build
  writes is the title React sets after hydration;
- `dist/` and the sitemap contain exactly the routes in `tests/routes.ts`, every
  internal link resolves to a file that exists, and `llms.txt` has not drifted;
- the FAQ rendered on the homepage, the `FAQPage` JSON-LD and the `## FAQ` section of
  `llms.txt` list the same questions in the same order;
- no WCAG 2.1 AA violations on any route, at desktop and phone width — which is what
  keeps the contrast claim above honest;
- the reveal animation, the print stylesheet, prefetch-on-hover and the clipboard.

Lighthouse holds accessibility, best practices and SEO at exactly 100. The performance
*score* carries a floor of 0.99 rather than 1, because it is computed from measured
timings and moves with whatever hardware the runner is given — the same build scores 100
on PageSpeed and 99 locally on a tenth of a second of LCP. Everything underneath it that
does not depend on the machine is pinned exactly instead: CLS at zero, no render-blocking
resources, no console errors, no third-party requests, and hard byte budgets. See the
comments in `lighthouserc.cjs`.
