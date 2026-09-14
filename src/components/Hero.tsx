import React from 'react';
import { ArrowUpRight, Download, Mail } from 'lucide-react';
import { PERSONAL } from '../data/portfolioData';
import avatar from '../assets/avatar.webp';

export const Hero: React.FC = () => (
  <section id="top" className="section hero">
    <div className="shell hero-grid">
      <div className="rise" data-in="true">
        <p className="status">
          <span className="dot" /> {PERSONAL.status}
        </p>

        <h1>
          <span className="hero-name">{PERSONAL.name}</span>
          AI-native
          <br />
          full-stack
          <br />
          <em>engineer.</em>
        </h1>

        <p className="hero-lede">
          Full-stack in the ordinary sense: <strong>React and TypeScript</strong> on the front,{' '}
          <strong>FastAPI and Node</strong> behind, <strong>Postgres and MySQL</strong> underneath.
          At <strong>Bipolar Factory</strong> I build the retail-analytics command center — the
          product layer around the AI systems, not the models themselves. Before that I founded{' '}
          <strong>Statix.pro</strong> and took its products 0 → 1.
        </p>

        <div className="hero-meta">
          <span>{PERSONAL.location}</span>
          <span>3+ yrs shipping production software</span>
          <span>React · TypeScript · Python</span>
        </div>

        <div className="hero-actions">
          <a className="btn btn-signal btn-lg" href="#projects">
            View selected work <ArrowUpRight size={15} />
          </a>
          <a className="btn btn-lg" href={PERSONAL.resume} download>
            <Download size={15} /> Résumé
          </a>
          <a className="btn btn-lg" href={`mailto:${PERSONAL.email}`}>
            <Mail size={15} /> Email me
          </a>
        </div>
      </div>

      <figure className="plate rise" data-in="true">
        <div className="plate-inner">
          <img src={avatar} alt="Illustrated portrait of Maheshwaran A K" width={640} height={640} />
        </div>
        <figcaption className="plate-cap">
          <span>~/mahesh.png</span>
          <span>vibe coder</span>
        </figcaption>
      </figure>
    </div>
  </section>
);
