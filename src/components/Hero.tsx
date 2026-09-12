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
          AI-native
          <br />
          full-stack
          <br />
          <em>engineer.</em>
        </h1>

        <p className="hero-lede">
          I build the interfaces that make <strong>Edge-AI and computer-vision systems</strong>{' '}
          legible to the people who run on them — real-time heatmaps, demographics and ANPR at{' '}
          <strong>Bipolar Factory</strong>. Before that I founded <strong>Statix.pro</strong> and
          took its products 0 → 1.
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
