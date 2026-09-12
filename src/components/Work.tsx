import React from 'react';
import { EXPERIENCE } from '../data/portfolioData';
import { Section } from './Section';

export const Work: React.FC = () => (
  <Section
    id="work"
    index="01"
    label="Experience"
    title="Where I've shipped."
    note="Three roles, one through-line: taking systems that are hard to reason about and giving people a surface they can work from."
  >
    {EXPERIENCE.map((job, i) => (
      <article className="log-row rise" key={job.company} data-delay={i * 60}>
        <div className="log-when">
          {job.isCurrent && (
            <span className="now">
              <span className="dot" /> Current
            </span>
          )}
          <p>{job.period}</p>
          <p>{job.location}</p>
        </div>

        <div>
          <h3 className="log-role">{job.role}</h3>
          <p className="log-org">{job.company}</p>

          <ul className="bullets">
            {job.achievements.map((a) => (
              // Content is authored in portfolioData.ts, not user input.
              <li key={a} dangerouslySetInnerHTML={{ __html: a }} />
            ))}
          </ul>

          <p className="stack-line">
            {job.stack.map((s, idx) => (
              <React.Fragment key={s}>
                {idx > 0 && <i>/</i>}
                {s}
              </React.Fragment>
            ))}
          </p>
        </div>
      </article>
    ))}
  </Section>
);
