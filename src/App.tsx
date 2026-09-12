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

export const App: React.FC = () => {
  const path = usePath();
  const isCaseStudy = path === CASE_STUDY_PATH;

  useReveal();

  useEffect(() => {
    document.title = isCaseStudy
      ? 'Institutional Finance Platform — Case study — Maheshwaran A K'
      : 'Maheshwaran A K — AI-Native Full-Stack Engineer';
  }, [isCaseStudy]);

  return isCaseStudy ? <CaseStudy /> : <Portfolio />;
};

export default App;
