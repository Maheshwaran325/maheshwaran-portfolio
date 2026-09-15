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
  data/portfolioData.ts  single source of truth for all content
  hooks/
    useReveal.ts         scroll-in reveal for .rise elements
    useActiveSection.ts  nav highlighting
  components/            Nav, Hero, Metrics, Work, Projects, Stack, Credentials, Contact
  assets/fonts/          self-hosted subsets, built by scripts/build-fonts.sh
  assets/avatar*.webp    hero portrait srcset, built by scripts/build-images.py
public/
  Maheshwaran-A-K-Resume.pdf
  og.png                 1200x630 social card; its figure is restamped by build-images.py
  portrait.webp          referenced by the Person JSON-LD
  favicon.ico, favicon-96.png, apple-touch-icon.png
```

**To change content, edit `src/data/portfolioData.ts` only.** Components read from it.
Highlight strings may contain `<strong>` for emphasis; they are rendered as HTML, so keep
them authored here rather than sourced from user input.

## Commands

```bash
npm run dev       # vite dev server
npm run build     # tsc -b && vite build
npm run preview   # serve the production build
npm run lint      # oxlint

# Both write committed files, so they only run when the inputs change:
./scripts/build-fonts.sh   # webfont subsets (needs uv)

# Fallback metrics, so the webfont swap does not move the page. Paste into index.css.
uv run --with fonttools python scripts/font-metrics.py

# Everything derived from the illustration: the avatar srcset, the nav mark,
# portrait.webp, the favicons, and the figure standing in og.png. Pass new
# artwork to replace it; with no argument it rebuilds from the master.
uv run --with pillow --with numpy --with scipy python scripts/build-images.py [source.png]
```
