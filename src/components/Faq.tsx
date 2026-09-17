import React from 'react';
import { FAQ } from '../data/portfolioData';
import { Section } from './Section';

/**
 * Deliberately not an accordion. A <details> block keeps its answer in the
 * DOM, so a crawler would still find it, but collapsing nine answers hides
 * the one thing this section exists to put in front of people. Everything is
 * open, and the hairline rules do the separating.
 */
export const Faq: React.FC = () => (
  <Section
    id="faq"
    index="05"
    label="Questions"
    title="Asked and answered."
    note="The things people email to ask before they email to ask anything else."
  >
    {FAQ.map((item, i) => (
      <div className="faq rise" key={item.q} data-delay={i * 40}>
        <h3 className="faq-q">{item.q}</h3>
        {/* Content is authored in portfolioData.ts, not user input. */}
        <p className="faq-a" dangerouslySetInnerHTML={{ __html: item.a }} />
      </div>
    ))}
  </Section>
);
