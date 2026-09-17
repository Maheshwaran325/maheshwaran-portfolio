import React, { useState } from 'react';
import { Check, Copy, MapPin } from 'lucide-react';
import { PERSONAL } from '../data/portfolioData';
import { GithubIcon, LinkedinIcon, XIcon } from './Icons';

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL.email);
    } catch {
      return; // clipboard blocked — the mailto link above still works
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section id="contact" className="section">
      <div className="shell">
        <header className="sec-head rise">
          <p className="sec-index">
            <b>06</b> Contact
          </p>
          <h2 className="sec-title">Let's build something.</h2>
          <p className="sec-note">
            Open to full-stack and AI engineering roles. The fastest way to reach me is email — I
            reply within a day.
          </p>
        </header>

        <div className="rise">
          <a className="mailto" href={`mailto:${PERSONAL.email}`}>
            {PERSONAL.email}
          </a>
          <div style={{ marginTop: '1.5rem' }}>
            <button className="btn" onClick={copyEmail}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy address'}
            </button>
          </div>
        </div>

        <div className="contact-grid rise">
          <a
            className="contact-cell"
            href={PERSONAL.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="k">LinkedIn</p>
            <p className="v">
              <LinkedinIcon size={15} /> /in/maheshwaranak
            </p>
          </a>

          <a
            className="contact-cell"
            href={PERSONAL.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="k">GitHub</p>
            <p className="v">
              <GithubIcon size={15} /> @Maheshwaran325
            </p>
          </a>

          <a className="contact-cell" href={PERSONAL.x} target="_blank" rel="noopener noreferrer">
            <p className="k">X</p>
            <p className="v">
              <XIcon size={14} /> @gingfreecss325
            </p>
          </a>

          <div className="contact-cell">
            <p className="k">Based in</p>
            <p className="v">
              <MapPin size={15} /> Salem, Tamil Nadu
            </p>
          </div>

          <div className="contact-cell">
            <p className="k">Status</p>
            <p className="v">
              <span className="dot" /> {PERSONAL.status}
            </p>
          </div>
        </div>
      </div>

      <div className="shell">
        <footer className="footer">
          <span>© {new Date().getFullYear()} Maheshwaran A K</span>
          <nav className="foot-links" aria-label="Site">
            <a href="/work/">Work</a>
            <a href="/resume/">Résumé</a>
            <a href="/changelog/">Changelog</a>
            <a
              href="https://github.com/Maheshwaran325/maheshwaran-portfolio"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source
            </a>
          </nav>
          <span>Built with React, TypeScript & Vite</span>
        </footer>
      </div>
    </section>
  );
};
