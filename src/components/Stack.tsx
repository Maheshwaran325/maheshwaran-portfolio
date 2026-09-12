import React from 'react';
import { STACK } from '../data/portfolioData';
import { Section } from './Section';

export const Stack: React.FC = () => (
  <Section
    id="stack"
    index="03"
    label="Toolkit"
    title="What I reach for."
    note="Listed by where it sits in the system, not by how good I claim to be at it. The t-shirt isn't ironic — I ship with coding agents every day, and I've put most of them through real work."
  >
    {STACK.map((group, i) => (
      <div className="st-row rise" key={group.key} data-delay={i * 50}>
        <p className="st-key">{group.key}</p>
        <div className="st-vals">
          {group.items.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    ))}
  </Section>
);
