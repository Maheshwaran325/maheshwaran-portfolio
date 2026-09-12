import React from 'react';
import { METRICS } from '../data/portfolioData';

export const Metrics: React.FC = () => (
  <section className="shell" aria-label="Impact at a glance">
    <div className="metrics">
      {METRICS.map((m, i) => (
        <div className="metric rise" key={m.label} data-delay={i * 70}>
          <p className="metric-v">{m.value}</p>
          <p className="metric-l">{m.label}</p>
          <p className="metric-s">{m.sub}</p>
        </div>
      ))}
    </div>
  </section>
);
