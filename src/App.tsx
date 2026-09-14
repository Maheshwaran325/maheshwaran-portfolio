import React, { useEffect, useState } from 'react';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Metrics } from './components/Metrics';
import { Work } from './components/Work';
import { Projects } from './components/Projects';
import { Stack } from './components/Stack';
import { Credentials } from './components/Credentials';
import { Contact } from './components/Contact';
import { CaseStudy } from './pages/CaseStudy';
import { Guide2Profit } from './pages/Guide2Profit';
import { NotFound } from './pages/NotFound';
import { useReveal } from './hooks/useReveal';

export const CASE_STUDY_PATH = '/work/institutional-platform';
export const GUIDE2PROFIT_PATH = '/work/guide2profit';

const normalize = (p: string): string => p.replace(/\/+$/, '') || '/';

/**
 * Two pages don't justify a router dependency. `initial` is supplied when
 * prerendering, where there is no `window`; the browser reads its own URL and
 * arrives at the same value, so hydration matches.
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
      <Contact />
    </main>
  </>
);

/** Every real route is a static file; anything else is served as a 404. */
const TITLES: Record<string, string> = {
  '/': 'Maheshwaran A K — AI-Native Full-Stack Engineer',
  [CASE_STUDY_PATH]: 'Institutional Finance Platform — Case study — Maheshwaran A K',
  [GUIDE2PROFIT_PATH]: 'Guide2Profit — Case study — Maheshwaran A K',
};

export const App: React.FC<{ path?: string }> = ({ path: initial }) => {
  const path = usePath(initial);

  useReveal();

  useEffect(() => {
    document.title = TITLES[path] ?? 'Page not found — Maheshwaran A K';
  }, [path]);

  if (path === CASE_STUDY_PATH) return <CaseStudy />;
  if (path === GUIDE2PROFIT_PATH) return <Guide2Profit />;
  if (path === '/') return <Portfolio />;
  return <NotFound />;
};

export default App;
