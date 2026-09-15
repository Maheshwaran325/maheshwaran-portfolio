import React, { useEffect, useState } from 'react';
import { FileText, Menu, X } from 'lucide-react';
import { NAV } from '../data/portfolioData';
import { useActiveSection } from '../hooks/useActiveSection';
import mark from '../assets/mark.webp';

const IDS = NAV.map((n) => n.href.slice(1));

export const Nav: React.FC = () => {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(IDS);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="nav" data-stuck={stuck || open}>
      <div className="shell nav-in">
        <a className="brand" href="#top">
          <span className="brand-mark">
            <img src={mark} alt="" width={96} height={96} />
          </span>
          <span className="brand-name">
            maheshwaran<span>.ak</span>
          </span>
        </a>

        <nav className="nav-links" aria-label="Sections">
          {NAV.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link"
              data-active={active === link.href.slice(1)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-cta">
          {/* The page, not the PDF. A file download is a dead end — nothing to
              link to, nothing to index, and a pinch-to-zoom document on a
              phone. /resume offers the PDF to anyone who wants the file. */}
          <a className="btn btn-signal" href="/resume/">
            <FileText size={14} />
            <span>Résumé</span>
          </a>
          <button
            className="burger"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="drawer">
          {NAV.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
