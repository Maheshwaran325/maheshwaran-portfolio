/**
 * Turns the client bundle into real, readable HTML.
 *
 * Two reasons this exists. The app sets document.title client-side, which
 * crawlers and link unfurlers never run, so each route needs its own metadata.
 * And AI crawlers (GPTBot, ClaudeBot, PerplexityBot) do not execute JavaScript
 * at all, so a client-only render leaves them an empty <div id="root">. Both
 * routes are therefore rendered to HTML here and hydrated in the browser.
 *
 * Netlify matches static files before redirect rules, so these are served
 * directly and the catch-all only ever sees genuinely unknown URLs.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';

const DIST = 'dist';
const SITE = 'https://maheshwaran.dev';
const TODAY = new Date().toISOString().slice(0, 10);

const { render, PERSONAL, EXPERIENCE, PROJECTS } = await import('../dist-ssr/entry-server.js');

/**
 * Date the route's content last changed, so sitemap lastmod describes the
 * content rather than the deploy. Falls back to today when git is unavailable
 * or the file's history sits outside a shallow clone.
 */
function lastModified(sources) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...sources], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : TODAY;
  } catch {
    return TODAY;
  }
}

const ROUTES = [
  {
    path: '',
    sources: ['index.html', 'src/components', 'src/data/portfolioData.ts'],
  },
  {
    path: 'work/institutional-platform',
    title: 'Institutional Finance & Research Platform — Case study — Maheshwaran A K',
    description:
      'How I designed and built a multi-tenant ERP running budgeting, expenditure and settlement for a 39-department institution: one configurable approval engine, roles as data, and an audit trail money can be traced through.',
    image: `${SITE}/og-case-study.png`,
    breadcrumb: 'Institutional Finance & Research Platform',
    sources: ['src/pages/CaseStudy.tsx', 'src/data/caseStudyData.ts'],
  },
  {
    path: 'work/guide2profit',
    title: 'Guide2Profit — Startup financial modelling — Case study — Maheshwaran A K',
    description:
      'Turning a founder\u2019s spreadsheet financial model into a system: four input modules feeding seven calculation engines, and a Gemini assistant deliberately forbidden from doing the arithmetic.',
    image: `${SITE}/og.png`,
    breadcrumb: 'Guide2Profit',
    sources: ['src/pages/Guide2Profit.tsx', 'src/data/guide2profitData.ts'],
  },
];

/**
 * Structured data for the homepage, built from the same data the page renders.
 * ProfilePage tells Google and LLM crawlers that this page *is* the person,
 * rather than merely mentioning one; the graph gives them facts to extract.
 */
function personGraph() {
  const id = `${SITE}/#person`;
  const strip = (html) => html.replace(/<[^>]+>/g, '');

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${SITE}/#profile`,
        url: `${SITE}/`,
        name: `${PERSONAL.name} — ${PERSONAL.role}`,
        dateModified: lastModified(ROUTES[0].sources),
        mainEntity: { '@id': id },
        inLanguage: 'en',
      },
      {
        '@type': 'Person',
        '@id': id,
        name: PERSONAL.name,
        alternateName: ['A K Maheshwaran', 'Maheshwaran K', 'Maheshwaran'],
        description:
          `${PERSONAL.name} is an ${PERSONAL.role} based in ${PERSONAL.location}. ` +
          `He works at ${PERSONAL.company} building the product layer around retail-analytics ` +
          `AI systems, and previously founded Statix.pro. He builds React and TypeScript ` +
          `front ends over FastAPI, Node and Postgres.`,
        jobTitle: EXPERIENCE[0].role,
        image: `${SITE}/portrait.webp`,
        url: `${SITE}/`,
        email: `mailto:${PERSONAL.email}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Salem',
          addressRegion: 'Tamil Nadu',
          addressCountry: 'IN',
        },
        worksFor: { '@type': 'Organization', name: PERSONAL.company },
        alumniOf: {
          '@type': 'CollegeOrUniversity',
          name: 'K.S. Rangasamy College of Technology',
        },
        knowsAbout: [...new Set(EXPERIENCE.flatMap((job) => job.stack))],
        hasOccupation: {
          '@type': 'Occupation',
          name: 'Full-Stack Software Engineer',
          occupationLocation: { '@type': 'City', name: 'Salem' },
          skills: [...new Set(EXPERIENCE.flatMap((job) => job.stack))].join(', '),
        },
        sameAs: [PERSONAL.github, PERSONAL.linkedin, PERSONAL.x],
      },
      ...PROJECTS.map((project) => ({
        '@type': 'CreativeWork',
        name: project.title,
        description: strip(project.tagline),
        author: { '@id': id },
        creator: { '@id': id },
        keywords: project.stack.join(', '),
        ...(project.links?.[0]?.href?.startsWith('http')
          ? { url: project.links[0].href }
          : project.links?.[0]
            ? { url: `${SITE}${project.links[0].href}` }
            : {}),
      })),
    ],
  };
}

const shell = await readFile(join(DIST, 'index.html'), 'utf8');

const ROOT = '<div id="root"></div>';
if (!shell.includes(ROOT)) throw new Error('no empty #root in shell — did the build change?');

/** Replace the content of a meta tag, matching either attribute order. */
function setMeta(html, kind, key, value) {
  const re = new RegExp(`(<meta\\s+${kind}="${key}"\\s+content=")[^"]*(")`, 'i');
  if (!re.test(html)) throw new Error(`meta ${kind}="${key}" not found in shell`);
  return html.replace(re, `$1${value}$2`);
}

/** Append a JSON-LD block to the document head. */
function addJsonLd(html, data) {
  return html.replace(
    '</head>',
    `  <script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n    </script>\n  </head>`,
  );
}

/** Drop the prerendered markup into the shell's root node. */
function withMarkup(html, path) {
  return html.replace(ROOT, `<div id="root">${render(path)}</div>`);
}

for (const route of ROUTES) {
  const url = `${SITE}/${route.path}`;
  let html = withMarkup(shell, `/${route.path}`);

  // The homepage's metadata already lives in the shell; extra routes override.
  if (route.title) {
    const titleRe = /<title>[^<]*<\/title>/i;
    if (!titleRe.test(html)) throw new Error('no <title> in shell');
    html = html.replace(titleRe, `<title>${route.title}</title>`);

    html = setMeta(html, 'name', 'description', route.description);
    html = setMeta(html, 'property', 'og:title', route.title);
    html = setMeta(html, 'property', 'og:description', route.description);
    html = setMeta(html, 'property', 'og:url', url);
    html = setMeta(html, 'property', 'og:image', route.image);
    html = setMeta(html, 'name', 'twitter:title', route.title);
    html = setMeta(html, 'name', 'twitter:description', route.description);
    html = setMeta(html, 'name', 'twitter:image', route.image);

    const canonicalRe = /(<link\s+rel="canonical"\s+href=")[^"]*(")/i;
    if (!canonicalRe.test(html)) throw new Error('no canonical link in shell');
    html = html.replace(canonicalRe, `$1${url}$2`);

    // The shell's Person block describes the author; add what this page is.
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: route.title,
          description: route.description,
          image: route.image,
          url,
          author: { '@type': 'Person', '@id': `${SITE}/#person`, name: PERSONAL.name },
          publisher: { '@id': `${SITE}/#person` },
          inLanguage: 'en',
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: PERSONAL.name, item: `${SITE}/` },
            { '@type': 'ListItem', position: 2, name: route.breadcrumb },
          ],
        },
      ],
    };
    html = addJsonLd(html, jsonLd);
  }

  if (!route.title) html = addJsonLd(html, personGraph());

  const out = join(DIST, route.path, 'index.html');
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, html, 'utf8');
  console.log(`emitted ${out}`);
}

// --- 404 --------------------------------------------------------------------
// Without this the catch-all would answer every unknown URL with the homepage
// at status 200, which Google reads as a soft 404 and as duplicates of /.
{
  const title = 'Page not found — Maheshwaran A K';
  let html = withMarkup(shell, '/404');
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);
  html = setMeta(html, 'name', 'description', 'This page does not exist.');
  html = setMeta(html, 'property', 'og:title', title);
  html = setMeta(html, 'name', 'twitter:title', title);
  // A 404 must not claim a canonical URL, and must not be indexed.
  html = html.replace(/<link\s+rel="canonical"[^>]*>/i, '<meta name="robots" content="noindex" />');

  await writeFile(join(DIST, '404.html'), html, 'utf8');
  console.log('emitted dist/404.html');
}

// --- sitemap covering every route -------------------------------------------
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map(
  (r) => `  <url>
    <loc>${SITE}/${r.path}</loc>
    <lastmod>${lastModified(r.sources)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${r.path === '' ? '1.0' : '0.8'}</priority>
  </url>`,
).join('\n')}
</urlset>
`;
await writeFile(join(DIST, 'sitemap.xml'), sitemap, 'utf8');
console.log(`sitemap.xml lists ${ROUTES.length} urls`);
