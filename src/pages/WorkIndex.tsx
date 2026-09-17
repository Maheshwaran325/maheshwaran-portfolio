import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CAPABILITY_GROUPS, WORK_INDEX } from '../data/workIndexData';
import { PERSONAL } from '../data/portfolioData';
import { CaseStudyBar, CaseStudyCta, CaseStudyFooter } from '../components/CaseStudyParts';

/**
 * /work/ — the index the three case studies hang off.
 *
 * It existed as a URL long before it existed as a page: /work/land2build/ was
 * reachable and /work/ answered 404. Filling it with a project list would have
 * been the obvious move and the less useful one, so it is grouped by the kind
 * of problem instead, which is the thing someone is actually searching for.
 */
export const WorkIndex: React.FC = () => (
  <>
    <CaseStudyBar />

    <main>
      <section className="section cs-hero">
        <div className="shell">
          <p className="sec-index rise" data-in="true">
            <b>{WORK_INDEX.kicker}</b>
          </p>
          <h1 className="cs-title rise" data-in="true">
            {WORK_INDEX.title}
          </h1>
          <p className="cs-lede rise" data-in="true">
            {WORK_INDEX.lede}
          </p>
        </div>
      </section>

      {CAPABILITY_GROUPS.map((group) => (
        <section className="section" key={group.index}>
          <div className="shell">
            <header className="sec-head rise">
              <p className="sec-index">
                <b>{group.index}</b> Capability
              </p>
              <h2 className="sec-title cap-title">{group.title}</h2>
            </header>

            <p className="cap-for rise">
              <span>For</span> {group.forWho}
            </p>

            <div className="prose rise">
              {group.body.map((para) => (
                // Content is authored in workIndexData.ts, not user input.
                <p key={para} dangerouslySetInnerHTML={{ __html: para }} />
              ))}
            </div>

            <ul className="cap-ev rise">
              {group.evidence.map((item) => (
                <li key={item.claim}>
                  <span dangerouslySetInnerHTML={{ __html: item.claim }} />
                  {item.href && (
                    <a
                      className="link-u cap-ev-link"
                      href={item.href}
                      {...(item.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {item.label} <ArrowUpRight size={13} style={{ display: 'inline', verticalAlign: '-2px' }} />
                    </a>
                  )}
                </li>
              ))}
            </ul>

            <p className="stack-line rise">
              {group.stack.map((s, i) => (
                <React.Fragment key={s}>
                  {i > 0 && <i>/</i>}
                  {s}
                </React.Fragment>
              ))}
            </p>
          </div>
        </section>
      ))}

      <CaseStudyCta
        title="Any of that sound like your problem?"
        note={`${PERSONAL.name} is available for full-time roles and freelance contracts, remote, from India Standard Time. Email is the fastest way to reach me and I reply within a day.`}
      />
    </main>

    <CaseStudyFooter note="Grouped by problem, not by project" />
  </>
);
