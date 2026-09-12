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
public/
  Maheshwaran-A-K-Resume.pdf
  og.png                 1200x630 social card
  favicon-64.png, apple-touch-icon.png
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
```
