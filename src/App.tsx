import React, { useEffect, useState } from 'react';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Metrics } from './components/Metrics';
import { Work } from './components/Work';
import { Projects } from './components/Projects';
import { Stack } from './components/Stack';
import { Credentials } from './components/Credentials';
import { Faq } from './components/Faq';
import { Contact } from './components/Contact';
import { WorkIndex } from './pages/WorkIndex';
import { CaseStudy } from './pages/CaseStudy';
import { Guide2Profit } from './pages/Guide2Profit';
import { Land2Build } from './pages/Land2Build';
import { Resume } from './pages/Resume';
import { Changelog } from './pages/Changelog';
import { NotFound } from './pages/NotFound';
import { useReveal } from './hooks/useReveal';
import { usePrefetch } from './hooks/usePrefetch';

export const WORK_INDEX_PATH = '/work';
export const CASE_STUDY_PATH = '/work/institutional-platform';
export const GUIDE2PROFIT_PATH = '/work/guide2profit';
export const LAND2BUILD_PATH = '/work/land2build';
export const RESUME_PATH = '/resume';
export const CHANGELOG_PATH = '/changelog';

const normalize = (p: string): string => p.replace(/\/+$/, '') || '/';

/**
 * A handful of pages don't justify a router dependency. `initial` is supplied
 * when prerendering, where there is no `window`; the browser reads its own URL
 * and arrives at the same value, so hydration matches.
 */
function usePath(initial?: string): string {
  const [path, setPath] = useState(() => initial ?? normalize(window.location.pathname));
  useEffect(() => {
    const onPop = () => setPath(normalize(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return path;
}

const Portfolio: React.FC = () => (
  <>
    <Nav />
    <main>
      <Hero />
      <Metrics />
      <Work />
      <Projects />
      <Stack />
      <Credentials />
      <Faq />
      <Contact />
    </main>
  </>
);

/**
 * Every real route is a static file; anything else is served as a 404.
 *
 * These must match the titles scripts/emit-route-html.mjs writes into each
 * emitted document, character for character. They used to be shorter, which
 * meant the tab title visibly changed the moment hydration ran and crawlers
 * read a different title from the one a visitor saw. tests/prerender.spec.ts
 * asserts the two agree.
 */
const TITLES: Record<string, string> = {
  '/': 'Maheshwaran A K — AI-Native Full-Stack Engineer',
  [WORK_INDEX_PATH]:
    'What I build — Multi-tenant systems, dashboards and LLM integration — Maheshwaran A K',
  [CASE_STUDY_PATH]:
    'Institutional Finance & Research Platform — Case study — Maheshwaran A K',
  [GUIDE2PROFIT_PATH]:
    'Guide2Profit — Startup financial modelling — Post-mortem — Maheshwaran A K',
  [LAND2BUILD_PATH]: 'Land2Build — Generated floor plans — Case study — Maheshwaran A K',
  [RESUME_PATH]: 'Résumé — Maheshwaran A K — AI-Native Full-Stack Engineer',
  [CHANGELOG_PATH]: 'Changelog — Maheshwaran A K',
};

export const App: React.FC<{ path?: string }> = ({ path: initial }) => {
  const path = usePath(initial);

  useReveal();
  usePrefetch();

  useEffect(() => {
    document.title = TITLES[path] ?? 'Page not found — Maheshwaran A K';
  }, [path]);

  if (path === WORK_INDEX_PATH) return <WorkIndex />;
  if (path === CASE_STUDY_PATH) return <CaseStudy />;
  if (path === GUIDE2PROFIT_PATH) return <Guide2Profit />;
  if (path === LAND2BUILD_PATH) return <Land2Build />;
  if (path === RESUME_PATH) return <Resume />;
  if (path === CHANGELOG_PATH) return <Changelog />;
  if (path === '/') return <Portfolio />;
  return <NotFound />;
};

export default App;
