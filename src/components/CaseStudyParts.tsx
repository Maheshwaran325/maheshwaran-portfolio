import React from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { PERSONAL } from '../data/portfolioData';

export interface ChapterMeta {
  index: string;
  label: string;
  title: string;
}

/** Numbered section heading shared by every case study. */
export const Chapter: React.FC<{ c: ChapterMeta; children: React.ReactNode }> = ({ c, children }) => (
  <section className="section">
    <div className="shell">
      <header className="sec-head rise">
        <p className="sec-index">
          <b>{c.index}</b> {c.label}
        </p>
        <h2 className="sec-title">{c.title}</h2>
      </header>
      {children}
    </div>
  </section>
);

/** A row of figures. */
export const Figures: React.FC<{ rows: { v: string; l: string; s: string }[] }> = ({ rows }) => (
  <div className="metrics">
    {rows.map((m, i) => (
      <div className="metric rise" key={m.l} data-delay={i * 70}>
        <p className="metric-v">{m.v}</p>
        <p className="metric-l">{m.l}</p>
        <p className="metric-s">{m.s}</p>
      </div>
    ))}
  </div>
);

export const CaseStudyBar: React.FC = () => (
  <header className="cs-bar">
    <div className="shell nav-in">
      <a className="btn" href="/">
        <ArrowLeft size={14} /> Back to portfolio
      </a>
      <a className="btn btn-signal" href={`mailto:${PERSONAL.email}`}>
        Get in touch
      </a>
    </div>
  </header>
);

export const CaseStudyCta: React.FC<{ title: string; note: React.ReactNode }> = ({ title, note }) => (
  <section className="section">
    <div className="shell">
      <h2 className="sec-title rise" style={{ maxWidth: '18ch' }}>
        {title}
      </h2>
      <p className="sec-note rise">{note}</p>
      <div className="hero-actions rise" style={{ marginTop: '2rem' }}>
        <a className="btn btn-signal btn-lg" href={`mailto:${PERSONAL.email}`}>
          Email me <ArrowUpRight size={15} />
        </a>
        <a className="btn btn-lg" href="/">
          <ArrowLeft size={15} /> Back to portfolio
        </a>
      </div>
    </div>
  </section>
);

export const CaseStudyFooter: React.FC<{ note: string }> = ({ note }) => (
  <div className="shell">
    <footer className="footer">
      {/* One text child: adjacent JSX expressions emit separators that
          break hydration. */}
      <span>{`© ${new Date().getFullYear()} ${PERSONAL.name}`}</span>
      <span>{note}</span>
    </footer>
  </div>
);
