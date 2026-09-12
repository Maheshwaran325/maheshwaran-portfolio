import React from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { BUILD, CASE, CHAPTERS, SCALE, STAGES } from '../data/caseStudyData';
import { PERSONAL } from '../data/portfolioData';
import { ApprovalDiagram, LayerDiagram } from '../components/Diagrams';

const Chapter: React.FC<{ n: number; children: React.ReactNode }> = ({ n, children }) => {
  const c = CHAPTERS[n];
  return (
    <section className="section">
      <div className="shell">
        <header className="sec-head rise">
          <p className="sec-index">
            <b>{c.index}</b> {c.label}
          </p>
          <h2 className="sec-title">{c.title}</h2>
        </header>
        {children}
      </div>
    </section>
  );
};

const Figures: React.FC<{ rows: { v: string; l: string; s: string }[] }> = ({ rows }) => (
  <div className="metrics">
    {rows.map((m, i) => (
      <div className="metric rise" key={m.l} data-delay={i * 70}>
        <p className="metric-v">{m.v}</p>
        <p className="metric-l">{m.l}</p>
        <p className="metric-s">{m.s}</p>
      </div>
    ))}
  </div>
);

export const CaseStudy: React.FC = () => (
  <>
    <header className="cs-bar">
      <div className="shell nav-in">
        <a className="btn" href="/">
          <ArrowLeft size={14} /> Back to portfolio
        </a>
        <a className="btn btn-signal" href={`mailto:${PERSONAL.email}`}>
          Get in touch
        </a>
      </div>
    </header>

    <main>
      {/* ---------- hero ---------- */}
      <section className="section cs-hero">
        <div className="shell">
          <p className="sec-index rise" data-in="true">
            <b>{CASE.kicker}</b>
          </p>
          <h1 className="cs-title rise" data-in="true">
            {CASE.title}
          </h1>
          <p className="cs-lede rise" data-in="true">
            {CASE.summary}
          </p>

          <dl className="cs-meta rise" data-in="true">
            {CASE.meta.map((m) => (
              <div key={m.k}>
                <dt>{m.k}</dt>
                <dd>{m.v}</dd>
              </div>
            ))}
          </dl>

          <p className="stack-line rise" data-in="true">
            {CASE.stack.map((s, i) => (
              <React.Fragment key={s}>
                {i > 0 && <i>/</i>}
                {s}
              </React.Fragment>
            ))}
          </p>
        </div>
      </section>

      <section className="shell" aria-label="Scale">
        <Figures rows={SCALE} />
      </section>

      {/* ---------- 01 context ---------- */}
      <Chapter n={0}>
        <div className="prose rise">
          <p>
            A 39-department institution ran its budgeting, expenditure and research funding on
            paper forms, spreadsheets and email. A single proposal could touch four desks before
            anyone committed money, and none of those handoffs left a record anyone could query
            later.
          </p>
          <p>
            The consequences were mundane and expensive. Nobody could answer{' '}
            <em>&ldquo;how much of this head is already committed?&rdquo;</em> without phoning
            around. Approvals stalled with no way to see where. At audit time, reconstructing the
            trail for a single settlement meant digging through folders.
          </p>
          <p>
            The brief was not &ldquo;digitise the forms&rdquo;. It was to make the money
            <strong> traceable</strong> — every rupee attributable to a head, a proposal, an
            approver and a date.
          </p>
        </div>
      </Chapter>

      {/* ---------- 02 approval engine ---------- */}
      <Chapter n={1}>
        <div className="prose rise">
          <p>
            Budget proposals, expenditure claims, advances, settlements and journal submissions
            all look like different forms to a user. Structurally they are the same thing: a
            document that moves through ordered stages, where each stage can approve, return or
            reject, and where returning must not lose the history.
          </p>
          <p>
            Building five separate workflows would have meant five places to fix every bug. I
            built <strong>one engine</strong> and configured the stages per document type.
          </p>
        </div>

        <div className="rise">
          <ApprovalDiagram />
        </div>

        <ul className="bullets rise" style={{ marginTop: '2rem' }}>
          {STAGES.map((s) => (
            <li key={s.actor}>
              <strong>{s.actor}</strong> — {s.does}
            </li>
          ))}
        </ul>

        <div className="prose rise" style={{ marginTop: '2rem' }}>
          <p>
            Two decisions did most of the work. First, a returned document goes back to the
            originator as the <em>same</em> document with an added event, not a fresh copy — so a
            proposal rejected twice still reads as one continuous history. Second, the balance
            check runs against <strong>committed</strong> funds rather than spent funds, so two
            proposals racing against the same head cannot both pass.
          </p>
        </div>
      </Chapter>

      {/* ---------- 03 access control ---------- */}
      <Chapter n={2}>
        <div className="prose rise">
          <p>
            The obvious implementation is an enum of roles in the codebase. It is also the one
            that guarantees a deploy every time the institution reshuffles a committee — and they
            reshuffle often.
          </p>
          <p>
            So roles are <strong>rows, not constants</strong>. Each carries a code, a display
            name, and flags marking whether it is system-owned or administrator-assignable. An
            administrator composes roles and scopes them to an organisational unit — a department,
            centre, cell or professional body — without an engineer being involved.
          </p>
          <p>
            Permissions are expressed with <strong>CASL</strong> and shared between server and
            client, so the same rules that authorise a request also decide whether a button
            renders. The UI never offers an action the API would refuse.
          </p>
          <p>
            Authentication runs through <strong>two identity providers</strong> — Google and
            Microsoft — because staff and students were already split across both. Sessions are
            JWT; authorisation is always re-derived server-side.
          </p>
        </div>
      </Chapter>

      {/* ---------- 04 data model ---------- */}
      <Chapter n={3}>
        <div className="prose rise">
          <p>
            Finance software is judged on whether it can explain itself a year later. The schema
            is built around that: allocations, commitments and disbursements are separate
            concerns, and state changes are recorded as events rather than overwritten columns.
          </p>
        </div>

        <div className="rise">
          <LayerDiagram />
        </div>

        <div className="prose rise" style={{ marginTop: '2rem' }}>
          <p>
            Every schema change ships as a <strong>forward migration</strong> — 33 of them so far
            — because a live system holding real financial records cannot be reset. Supporting
            documents (bank statements, annexures, claim evidence) are stored per category with
            validation on type and size, and referenced rather than embedded.
          </p>
          <p>
            The parts most likely to cause a quiet financial error — annual rollups, claim
            ownership, workflow transitions, notification de-duplication — are covered by{' '}
            <strong>35 test suites</strong>. That is where the tests are, because that is where a
            bug costs someone real money.
          </p>
        </div>

        <div style={{ marginTop: '2.5rem' }}>
          <Figures rows={BUILD} />
        </div>
      </Chapter>

      {/* ---------- 05 outcome ---------- */}
      <Chapter n={4}>
        <div className="prose rise">
          <p>
            The platform has run continuously for <strong>14+ months</strong> without a rewrite.
            It serves <strong>330+ active users</strong> across 39 departments and has processed{' '}
            <strong>₹43.4 Cr</strong> across 1,000+ budget proposals, plus 570+ finance requests
            covering advances, reconciliation and settlements.
          </p>
          <p>
            The outcome I care about most is not a number. Questions that used to require a phone
            call — <em>where is my proposal, what is left in this head, who approved this and
            when</em> — are now answered by a page.
          </p>
        </div>
      </Chapter>

      {/* ---------- 06 retrospective ---------- */}
      <Chapter n={5}>
        <div className="prose rise">
          <p>
            <strong>I would put the workflow engine behind a state machine definition sooner.</strong>{' '}
            The stages were configurable from early on, but the transition rules lived in code
            longer than they should have. Every new document type meant re-reading that code to
            be sure it was safe.
          </p>
          <p>
            <strong>I would add the audit trail on day one, not after the first audit question.</strong>{' '}
            Retrofitting event history onto tables that already had rows is meaningfully harder
            than designing for it, and some early records are thinner than I would like.
          </p>
          <p>
            <strong>I would introduce typed API contracts earlier.</strong> The client is
            TypeScript and the server is not, so the boundary was hand-maintained for too long.
            Generating clients from the OpenAPI specs — which exist for ten domains — would have
            removed a whole category of integration bug.
          </p>
        </div>
      </Chapter>

      {/* ---------- cta ---------- */}
      <section className="section">
        <div className="shell">
          <h2 className="sec-title rise" style={{ maxWidth: '18ch' }}>
            Want the detail?
          </h2>
          <p className="sec-note rise">
            The source is closed, but I am happy to walk through the architecture, the schema
            decisions or the approval engine in conversation.
          </p>
          <div className="hero-actions rise" style={{ marginTop: '2rem' }}>
            <a className="btn btn-signal btn-lg" href={`mailto:${PERSONAL.email}`}>
              Email me <ArrowUpRight size={15} />
            </a>
            <a className="btn btn-lg" href="/">
              <ArrowLeft size={15} /> Back to portfolio
            </a>
          </div>
        </div>
      </section>

      <div className="shell">
        <footer className="footer">
          <span>© {new Date().getFullYear()} Maheshwaran A K</span>
          <span>Client unnamed by request</span>
        </footer>
      </div>
    </main>
  </>
);
