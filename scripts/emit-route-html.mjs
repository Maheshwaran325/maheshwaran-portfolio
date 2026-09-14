/**
 * The app sets document.title client-side, which crawlers and link unfurlers
 * never run. So for each extra route we emit a real HTML file with its own
 * metadata. Netlify matches static files before the SPA redirect, so these are
 * served directly; React then renders the same route as usual.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const DIST = 'dist';
const SITE = 'https://maheshwaran.dev';

const ROUTES = [
  {
    path: 'work/institutional-platform',
    title: 'Institutional Finance & Research Platform — Case study — Maheshwaran A K',
    description:
      'How I designed and built a multi-tenant ERP running budgeting, expenditure and settlement for a 39-department institution: one configurable approval engine, roles as data, and an audit trail money can be traced through.',
    image: `${SITE}/og-case-study.png`,
    breadcrumb: 'Institutional Finance & Research Platform',
  },
];

const shell = await readFile(join(DIST, 'index.html'), 'utf8');

/** Replace the content of a meta tag, matching either attribute order. */
function setMeta(html, kind, key, value) {
  const re = new RegExp(`(<meta\\s+${kind}="${key}"\\s+content=")[^"]*(")`, 'i');
  if (!re.test(html)) throw new Error(`meta ${kind}="${key}" not found in shell`);
  return html.replace(re, `$1${value}$2`);
}

for (const route of ROUTES) {
  let html = shell;

  const titleRe = /<title>[^<]*<\/title>/i;
  if (!titleRe.test(html)) throw new Error('no <title> in shell');
  html = html.replace(titleRe, `<title>${route.title}</title>`);

  html = setMeta(html, 'name', 'description', route.description);
  html = setMeta(html, 'property', 'og:title', route.title);
  html = setMeta(html, 'property', 'og:description', route.description);
  html = setMeta(html, 'property', 'og:url', `${SITE}/${route.path}`);
  html = setMeta(html, 'property', 'og:image', route.image);
  html = setMeta(html, 'name', 'twitter:title', route.title);
  html = setMeta(html, 'name', 'twitter:description', route.description);
  html = setMeta(html, 'name', 'twitter:image', route.image);

  const canonicalRe = /(<link\s+rel="canonical"\s+href=")[^"]*(")/i;
  if (!canonicalRe.test(html)) throw new Error('no canonical link in shell');
  html = html.replace(canonicalRe, `$1${SITE}/${route.path}$2`);

  // The shell's Person block describes the author; add what this page itself is.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: route.title,
        description: route.description,
        image: route.image,
        url: `${SITE}/${route.path}`,
        author: { '@type': 'Person', name: 'Maheshwaran A K', url: `${SITE}/` },
        publisher: { '@type': 'Person', name: 'Maheshwaran A K', url: `${SITE}/` },
        inLanguage: 'en',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Maheshwaran A K', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: route.breadcrumb },
        ],
      },
    ],
  };
  html = html.replace(
    '</head>',
    `  <script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n    </script>\n  </head>`,
  );

  const out = join(DIST, route.path, 'index.html');
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, html, 'utf8');
  console.log(`emitted ${out}`);
}

// --- 404 --------------------------------------------------------------------
// Without this the SPA rule answers every unknown URL with the homepage at
// status 200, which Google reads as a soft 404 and as endless duplicates of /.
{
  let html = shell;
  const title = 'Page not found — Maheshwaran A K';
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
const urls = ['', ...ROUTES.map((r) => r.path)];
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE}/${u}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${u === '' ? '1.0' : '0.8'}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;
await writeFile(join(DIST, 'sitemap.xml'), sitemap, 'utf8');
console.log(`sitemap.xml lists ${urls.length} urls`);
