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
import { NotFound } from './pages/NotFound';
import { useReveal } from './hooks/useReveal';

export const CASE_STUDY_PATH = '/work/institutional-platform';

/** Two pages don't justify a router dependency. */
function usePath(): string {
  const [path, setPath] = useState(() => window.location.pathname.replace(/\/+$/, '') || '/');
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname.replace(/\/+$/, '') || '/');
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
};

export const App: React.FC = () => {
  const path = usePath();

  useReveal();

  useEffect(() => {
    document.title = TITLES[path] ?? 'Page not found — Maheshwaran A K';
  }, [path]);

  if (path === CASE_STUDY_PATH) return <CaseStudy />;
  if (path === '/') return <Portfolio />;
  return <NotFound />;
};

export default App;
