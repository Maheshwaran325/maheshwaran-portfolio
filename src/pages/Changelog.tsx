import React from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { COMMITS, type Commit } from 'virtual:changelog';
import { PERSONAL } from '../data/portfolioData';
import { GithubIcon } from '../components/Icons';

/**
 * The site's own history, read from git at build time by the `changelog`
 * plugin in vite.config.ts.
 *
 * The design calls itself an engineering log, so it may as well keep one. It
 * costs nothing to maintain — writing a commit message is writing the entry —
 * and it is the one page that shows the work rather than describing it.
 */

const REPO = 'https://github.com/Maheshwaran325/maheshwaran-portfolio';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Formatted by hand: toLocaleDateString differs between Node and the browser,
 *  which would desync the prerendered markup from the hydrated one. */
const monthOf = (iso: string): string => {
  const [year, month] = iso.split('-');
  return `${MONTHS[Number(month) - 1]} ${year}`;
};

const dayOf = (iso: string): string => String(Number(iso.split('-')[2]));

/** Commits grouped into the month they landed in, newest month first. */
function byMonth(commits: Commit[]): { month: string; entries: Commit[] }[] {
  const groups: { month: string; entries: Commit[] }[] = [];
  for (const commit of commits) {
    const month = monthOf(commit.date);
    const last = groups.at(-1);
    if (last?.month === month) last.entries.push(commit);
    else groups.push({ month, entries: [commit] });
  }
  return groups;
}

const GROUPS = byMonth(COMMITS);

export const Changelog: React.FC = () => (
  <>
    <header className="cs-bar">
      <div className="shell nav-in">
        <a className="btn" href="/">
          <ArrowLeft size={14} /> Back to portfolio
        </a>
        <a className="btn" href={REPO} target="_blank" rel="noopener noreferrer">
          <GithubIcon size={14} /> Source <ArrowUpRight size={13} />
        </a>
      </div>
    </header>

    <main>
      <section className="section cs-hero">
        <div className="shell">
          <p className="sec-index rise" data-in="true">
            <b>LOG</b> Changelog
          </p>
          <h1 className="cs-title rise" data-in="true">
            What changed, and when.
          </h1>
          <p className="cs-lede rise" data-in="true">
            This site is built in the open. Every entry below is a commit against{' '}
            <a className="link-u" href={REPO} target="_blank" rel="noopener noreferrer">
              the repository
            </a>
            , read straight from git when the page was built — so it describes what actually
            shipped rather than what I remembered to write down.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          {GROUPS.length === 0 ? (
            <p className="sec-note">
              History unavailable — this build had no git repository to read.
            </p>
          ) : (
            GROUPS.map((group) => (
              <article className="log-row rise" key={group.month}>
                <div className="log-when">
                  <p>{group.month}</p>
                  <p>{`${group.entries.length} ${group.entries.length === 1 ? 'commit' : 'commits'}`}</p>
                </div>

                <ul className="cl-list">
                  {group.entries.map((commit) => (
                    <li key={commit.sha}>
                      <a
                        className="cl-entry"
                        href={`${REPO}/commit/${commit.sha}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="cl-day">{dayOf(commit.date)}</span>
                        <span className="cl-subject">{commit.subject}</span>
                        <span className="cl-sha">{commit.sha}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </article>
            ))
          )}
        </div>
      </section>

      <div className="shell">
        <footer className="footer">
          {/* One text child: adjacent JSX expressions emit separators that
              break hydration. */}
          <span>{`© ${new Date().getFullYear()} ${PERSONAL.name}`}</span>
          <span>Generated from git at build time</span>
        </footer>
      </div>
    </main>
  </>
);
