import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { GithubIcon } from './Icons';
import stats from '../data/githubStats.json';

/**
 * Language mix across the public repos, synced by `npm run sync:github`.
 *
 * No stars or followers: they measure other people's attention rather than
 * the work. No last-push date either — this repo was one of the repos it
 * measured, so every sync moved the figure it had just written.
 */
export const GithubStats: React.FC = () => {
  const total = stats.languages.reduce((sum, lang) => sum + lang.count, 0);
  const summary = stats.languages.map((l) => `${l.name} ${l.count}`).join(', ');

  return (
    <div className="gh rise">
      <div className="gh-head">
        <p className="st-key">Public GitHub</p>
        <a className="gh-link" href={stats.url} target="_blank" rel="noopener noreferrer">
          <GithubIcon size={14} /> @{stats.user} <ArrowUpRight size={13} />
        </a>
      </div>

      <div className="gh-bar" role="img" aria-label={`Repositories by language: ${summary}`}>
        {stats.languages.map((lang, i) => (
          <span
            key={lang.name}
            style={{ width: `${(lang.count / total) * 100}%`, opacity: 1 - i * 0.22 }}
          />
        ))}
      </div>

      <p className="gh-legend" aria-hidden="true">
        {stats.languages.map((lang, i) => (
          <span key={lang.name}>
            <i style={{ opacity: 1 - i * 0.22 }} />
            {lang.name} <b>{lang.count}</b>
          </span>
        ))}
      </p>

      <p className="stack-line">
        {stats.publicRepos} original repos <i>/</i> forks and archives excluded
      </p>
    </div>
  );
};
