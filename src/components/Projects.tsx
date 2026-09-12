import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PROJECTS } from '../data/portfolioData';
import { Section } from './Section';

export const Projects: React.FC = () => (
  <Section
    id="projects"
    index="02"
    label="Selected work"
    title="Things people actually use."
    note="Four builds that went to production and stayed there. Numbers are real and measured, not estimated."
  >
    {PROJECTS.map((p, i) => (
      <article className="proj rise" key={p.title} data-delay={i * 60}>
        <div className="proj-idx">
          <b>{p.index}</b>
          <p>{p.period}</p>
        </div>

        <div>
          <h3 className="proj-title">
            {p.title}{' '}
            {p.status && (
              <span className="tag" data-live={Boolean(p.statusLive)}>
                {p.statusLive && <span className="dot" />}
                {p.status}
              </span>
            )}
          </h3>

          <p className="proj-tag">{p.tagline}</p>

          <ul className="bullets" style={{ marginTop: '1.4rem' }}>
            {p.highlights.map((h) => (
              // Content is authored in portfolioData.ts, not user input.
              <li key={h} dangerouslySetInnerHTML={{ __html: h }} />
            ))}
          </ul>

          <p className="stack-line">
            {p.stack.map((s, idx) => (
              <React.Fragment key={s}>
                {idx > 0 && <i>/</i>}
                {s}
              </React.Fragment>
            ))}
          </p>

          {p.links.length > 0 && (
            <div className="proj-links">
              {p.links.map((l) => (
                <a
                  key={l.href}
                  className={l.primary ? 'btn btn-signal' : 'btn'}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {l.label} <ArrowUpRight size={14} />
                </a>
              ))}
            </div>
          )}
        </div>
      </article>
    ))}
  </Section>
);
