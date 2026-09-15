import React from 'react';
import { ArrowLeft, Download, Mail, MapPin, Phone, Printer } from 'lucide-react';
import { CREDENTIALS, EXPERIENCE, PERSONAL, PROJECTS, STACK } from '../data/portfolioData';
import { GithubIcon, LinkedinIcon } from '../components/Icons';

/**
 * The résumé as a page rather than only a PDF.
 *
 * The PDF is a dead end: search engines and LLM crawlers index it poorly, it
 * cannot be linked to a specific role, and on a phone it is a pinch-to-zoom
 * document. This renders the same facts from portfolioData.ts — the same source
 * the homepage reads — so the two can never drift, and the PDF stays available
 * for anyone who wants a file to attach.
 *
 * Laid out to print: @media print in index.css drops the chrome and inverts to
 * ink on white, so Cmd-P produces something a recruiter can file.
 */

/** Projects worth a recruiter's attention; the rest live on the homepage. */
const SHORTLIST = PROJECTS.slice(0, 4);

const CONTACT = [
  { icon: <Mail size={14} />, label: PERSONAL.email, href: `mailto:${PERSONAL.email}` },
  { icon: <Phone size={14} />, label: PERSONAL.phone, href: PERSONAL.phoneHref },
  { icon: <GithubIcon size={14} />, label: 'github.com/Maheshwaran325', href: PERSONAL.github },
  { icon: <LinkedinIcon size={14} />, label: 'in/maheshwaranak', href: PERSONAL.linkedin },
];

export const Resume: React.FC = () => (
  <>
    <header className="cs-bar no-print">
      <div className="shell nav-in">
        <a className="btn" href="/">
          <ArrowLeft size={14} /> Back to portfolio
        </a>
        <div className="nav-cta">
          {/* Progressive enhancement: without JS the browser's own print
              command still works, so this is an extra, never the only way. */}
          <button className="btn" onClick={() => window.print()}>
            <Printer size={14} /> Print
          </button>
          <a className="btn btn-signal" href={PERSONAL.resume} download>
            <Download size={14} /> PDF
          </a>
        </div>
      </div>
    </header>

    <main className="resume">
      <section className="section cs-hero">
        <div className="shell">
          <p className="sec-index rise" data-in="true">
            <b>CV</b> Résumé
          </p>
          <h1 className="cs-title rise" data-in="true">
            {PERSONAL.name}
          </h1>
          <p className="cs-lede rise" data-in="true">
            {PERSONAL.role} in {PERSONAL.location}. React and TypeScript on the front, FastAPI and
            Node behind, Postgres and MySQL underneath. 3+ years shipping production software —
            currently the product layer around retail-analytics AI systems at {PERSONAL.company}.
          </p>

          <ul className="rs-contact rise" data-in="true">
            {CONTACT.map((c) => (
              <li key={c.label}>
                <a href={c.href}>
                  {c.icon}
                  <span>{c.label}</span>
                </a>
              </li>
            ))}
            <li>
              <span className="rs-place">
                <MapPin size={14} />
                <span>{PERSONAL.location}</span>
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <header className="sec-head rise">
            <p className="sec-index">
              <b>01</b> Experience
            </p>
          </header>

          {EXPERIENCE.map((job) => (
            <article className="log-row rise" key={job.company}>
              <div className="log-when">
                <p>{job.period}</p>
                <p>{job.location}</p>
              </div>

              <div>
                <h2 className="log-role">{job.role}</h2>
                <p className="log-org">{job.company}</p>

                <ul className="bullets">
                  {job.achievements.map((a) => (
                    // Authored in portfolioData.ts, never user input.
                    <li key={a} dangerouslySetInnerHTML={{ __html: a }} />
                  ))}
                </ul>

                <p className="stack-line">
                  {job.stack.map((s, i) => (
                    <React.Fragment key={s}>
                      {i > 0 && <i>/</i>}
                      {s}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <header className="sec-head rise">
            <p className="sec-index">
              <b>02</b> Selected projects
            </p>
          </header>

          {SHORTLIST.map((project) => (
            <article className="log-row rise" key={project.title}>
              <div className="log-when">
                <p>{project.period}</p>
                {project.status && <p>{project.status}</p>}
              </div>

              <div>
                <h2 className="log-role">{project.title}</h2>
                <p className="proj-tag">{project.tagline}</p>

                <p className="stack-line">
                  {project.stack.map((s, i) => (
                    <React.Fragment key={s}>
                      {i > 0 && <i>/</i>}
                      {s}
                    </React.Fragment>
                  ))}
                </p>

                <div className="proj-links no-print">
                  {project.links.map((link) => (
                    <a
                      className={link.primary ? 'btn btn-signal' : 'btn'}
                      key={link.href}
                      href={link.href}
                      {...(link.href.startsWith('http')
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <header className="sec-head rise">
            <p className="sec-index">
              <b>03</b> Stack
            </p>
          </header>

          {STACK.map((group) => (
            <div className="st-row rise" key={group.key}>
              <p className="st-key">{group.key}</p>
              <div className="st-vals">
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <header className="sec-head rise">
            <p className="sec-index">
              <b>04</b> Education & credentials
            </p>
          </header>

          {CREDENTIALS.map((cred) => (
            <div className="cred rise" key={cred.title}>
              <p className="cred-k">{cred.kind}</p>
              <div>
                <h2 className="cred-t">
                  {cred.href ? (
                    <a className="link-u" href={cred.href} target="_blank" rel="noopener noreferrer">
                      {cred.title}
                    </a>
                  ) : (
                    cred.title
                  )}
                </h2>
                <p className="cred-d">{cred.detail}</p>
                <p className="cred-m">{cred.meta}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="shell">
        <footer className="footer">
          {/* One text child per span: adjacent JSX expressions emit separators
              that break hydration. */}
          <span>{`© ${new Date().getFullYear()} ${PERSONAL.name}`}</span>
          <span>{`${PERSONAL.status} · maheshwaran.dev`}</span>
        </footer>
      </div>
    </main>
  </>
);
