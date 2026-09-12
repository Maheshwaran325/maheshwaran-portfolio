import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CREDENTIALS } from '../data/portfolioData';
import { Section } from './Section';

export const Credentials: React.FC = () => (
  <Section
    id="credentials"
    index="04"
    label="Record"
    title="Published, certified, graduated."
  >
    {CREDENTIALS.map((c, i) => (
      <div className="cred rise" key={c.title} data-delay={i * 50}>
        <p className="cred-k">{c.kind}</p>
        <div>
          <h3 className="cred-t">
            {c.href ? (
              <a className="link-u" href={c.href} target="_blank" rel="noopener noreferrer">
                {c.title} <ArrowUpRight size={14} style={{ display: 'inline', verticalAlign: '-2px' }} />
              </a>
            ) : (
              c.title
            )}
          </h3>
          <p className="cred-d">{c.detail}</p>
          <p className="cred-m">{c.meta}</p>
        </div>
      </div>
    ))}
  </Section>
);
