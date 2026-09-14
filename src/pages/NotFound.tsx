import React from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { PERSONAL } from '../data/portfolioData';

export const NotFound: React.FC = () => (
  <main>
    <section className="section cs-hero">
      <div className="shell">
        <p className="sec-index rise" data-in="true">
          <b>404</b> Page not found
        </p>
        <h1 className="cs-title rise" data-in="true">
          This page doesn&rsquo;t exist.
        </h1>
        <p className="cs-lede rise" data-in="true">
          The link may be out of date, or the address mistyped. Everything worth reading lives on
          the portfolio.
        </p>

        <div className="hero-actions rise" data-in="true">
          <a className="btn btn-signal btn-lg" href="/">
            <ArrowLeft size={15} /> Back to portfolio
          </a>
          <a className="btn btn-lg" href={`mailto:${PERSONAL.email}`}>
            <Mail size={15} /> Email me
          </a>
        </div>
      </div>
    </section>
  </main>
);
