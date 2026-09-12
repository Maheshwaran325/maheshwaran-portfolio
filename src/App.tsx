import React from 'react';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Metrics } from './components/Metrics';
import { Work } from './components/Work';
import { Projects } from './components/Projects';
import { Stack } from './components/Stack';
import { Credentials } from './components/Credentials';
import { Contact } from './components/Contact';
import { useReveal } from './hooks/useReveal';

export const App: React.FC = () => {
  useReveal();

  return (
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
};

export default App;
