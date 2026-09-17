import React from 'react';
import { BUILD, CASE, CHAPTERS, INPUTS, OUTPUTS } from '../data/guide2profitData';
import { GithubIcon } from '../components/Icons';
import {
  CaseStudyBar,
  CaseStudyCta,
  CaseStudyFooter,
  Chapter,
  Figures,
} from '../components/CaseStudyParts';

export const Guide2Profit: React.FC = () => (
  <>
    <CaseStudyBar />

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

          <div className="hero-actions rise" data-in="true" style={{ marginTop: '2rem' }}>
            <a
              className="btn btn-lg"
              href={CASE.repo}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon size={15} /> Read the source
            </a>
          </div>
        </div>
      </section>

      <section className="shell" aria-label="Build">
        <Figures rows={BUILD} />
      </section>

      {/* ---------- 01 context ---------- */}
      <Chapter c={CHAPTERS[0]}>
        <div className="prose rise">
          <p>
            The idea was not mine. A friend of mine had the domain knowledge and a financial
            model that worked — in a spreadsheet. We built it together: his concept, my code. My
            job was to turn that model into a system other founders could use without inheriting
            his formulas, his tab structure or his assumptions about which cell you were allowed
            to touch.
          </p>
          <p>
            Spreadsheets are excellent at financial modelling and terrible at being software.
            The maths is entangled with the layout, every copy immediately diverges from the
            original, and one overwritten cell silently corrupts every figure downstream with no
            warning and no history.
          </p>
          <p>
            So the brief was narrow and clear: keep the model, lose the spreadsheet. A founder
            should enter what they know — what it costs to start, who they will hire, what they
            expect to sell — and get back the statements an investor asks for.
          </p>
        </div>
      </Chapter>

      {/* ---------- 02 architecture ---------- */}
      <Chapter c={CHAPTERS[1]}>
        <div className="prose rise">
          <p>
            Startup finance has an awkward property: the outputs depend on each other. Break-even
            needs the P&amp;L. The P&amp;L needs the sales forecast and payroll. Funding
            requirement needs almost everything. Model that carelessly and you get a web of
            modules reading each other&rsquo;s database tables, where changing one number means
            guessing what else moved.
          </p>
          <p>
            The server is split down that seam instead. Everything a founder <em>enters</em> lives
            under one namespace; everything the system <em>derives</em> lives under another. Four
            input modules feed seven output modules, and the direction is strictly one-way.
          </p>
        </div>

        <ul className="bullets rise" style={{ marginTop: '2rem' }}>
          {INPUTS.map((s) => (
            <li key={s.actor}>
              <strong>{s.actor}</strong> — {s.does}
            </li>
          ))}
        </ul>

        <div className="prose rise" style={{ marginTop: '2rem' }}>
          <p>
            From those four, the system derives {OUTPUTS.length}:{' '}
            {OUTPUTS.join(', ').toLowerCase()}. Every input module is the same three files —
            controller, model, routes; every output module adds a fourth. A new financial output
            is a known shape rather than a design discussion.
          </p>
        </div>
      </Chapter>

      {/* ---------- 03 calculation ---------- */}
      <Chapter c={CHAPTERS[2]}>
        <div className="prose rise">
          <p>
            Each of the seven output modules carries a fourth file the input modules do not: a
            calculation engine. It holds the arithmetic, and it is the only file that does.
            Controllers handle the request, models handle persistence, and the engine is handed
            plain data and returns plain data.
          </p>
          <p>
            The break-even engine is the clearest example. It takes the sales forecast and the
            P&amp;L <em>as arguments</em> — not as queries — and returns an object. It reads
            nothing, writes nothing, and has no idea a database exists.
          </p>
          <p>
            That constraint buys two things. The arithmetic is testable without a database, and
            the dependency between outputs is visible in a function signature instead of buried in
            a query. If break-even needs the P&amp;L, you can see it in the parameter list.
          </p>
          <p>
            Six of the seven engines hold that line. The funding engine does not — it imports its
            own model and fetches rather than being handed what it needs. It is the one place the
            rule is broken, and it is also the module I find hardest to reason about, which is
            about as clean a demonstration of the rule&rsquo;s value as I could ask for.
          </p>
          <p>
            It also forces the edge cases into the open. Division by a gross margin of zero is the
            obvious way a financial model explodes, and the engines guard it explicitly rather
            than letting an <code>Infinity</code> propagate into a founder&rsquo;s forecast.
          </p>
        </div>

        <div style={{ marginTop: '2.5rem' }}>
          <Figures rows={BUILD} />
        </div>
      </Chapter>

      {/* ---------- 04 assistant ---------- */}
      <Chapter c={CHAPTERS[3]}>
        <div className="prose rise">
          <p>
            The product has an assistant built on Google Gemini. Founders using a financial
            planner do not usually know what &ldquo;capital work in progress&rdquo; means, and
            answering that in a glossary nobody opens is worse than answering it in place.
          </p>
          <p>
            The interesting decision is what the assistant is <strong>not</strong> allowed to do.
            Its system prompt forbids arithmetic outright — it explains what a figure means, what
            belongs in it and how to gather it, then hands the user back to the form. It never
            produces a number.
          </p>
          <p>
            This was deliberate. An <strong>LLM</strong> that confidently miscalculates a
            break-even point is worse than no assistant at all, because the output looks exactly as
            authoritative as the correct one. The deterministic engines own every figure in the
            product; the model owns the explanation and nothing else.
          </p>
          <p>
            It is personalised rather than generic: the service reads the user&rsquo;s stored
            startup stage, industry, business model and company description, and folds them into
            the prompt, so the guidance refers to the business actually being planned.
          </p>
          <p>
            It is also capped — twenty messages per user per day, enforced server-side and
            answered with a 429. An LLM endpoint with no ceiling is someone else&rsquo;s bill.
          </p>
        </div>
      </Chapter>

      {/* ---------- 05 why it stopped ---------- */}
      <Chapter c={CHAPTERS[4]}>
        <div className="prose rise">
          <p>
            We demoed it to a founder at Kissflow. His answer took about a minute, and it was
            right.
          </p>
          <p>
            A startup founder does not want to model their own finances. The work is tedious, the
            stakes are high enough that you want a professional, and the professionals already
            exist — you hire an auditor or an accountant and hand them the problem. Asking a
            founder to sit down and enter five years of payroll assumptions is asking them to do
            a job they were always going to delegate.
          </p>
          <p>
            We had built for a user who does not exist: someone financially literate enough to
            fill the inputs in correctly, but not yet organised enough to have hired the person
            who normally does. That gap is much thinner than it looks from inside the build.
          </p>
          <p>
            So we stopped. The product works — 14 screens, eleven modules, a Supabase-backed API
            — and none of that was the problem. It solved a headache founders resolve by paying
            someone else to have it.
          </p>
          <p>
            There is no live link on this page for the same reason there is no traffic. The
            Vercel frontend still serves, but the backend sits on a Supabase free tier that
            sleeps after inactivity, and it has been inactive for a long time. Calling it
            &ldquo;live&rdquo; would be a nicer sentence and a false one.
          </p>
        </div>
      </Chapter>

      {/* ---------- 06 retrospective ---------- */}
      <Chapter c={CHAPTERS[5]}>
        <div className="prose rise">
          <p>
            <strong>I would have had that conversation in week one.</strong> The objection that
            ended the project cost one demo and could have been sought out before a line was
            written. We spent five weeks building an answer and no time at all checking whether
            anyone had the question. That is the whole lesson, and it is not a technical one.
          </p>
          <p>
            <strong>I would write the engines in TypeScript.</strong> The calculation files are
            the one place in the codebase where a wrong type is genuinely expensive, and they are
            plain JavaScript. Every engine takes loosely-shaped objects from upstream modules and
            trusts the fields are there.
          </p>
          <p>
            <strong>I would test the engines from day one.</strong> They were built to be
            testable — pure, no I/O, arguments in and an object out — and then not tested. That is
            the cheapest test suite in the project going unwritten.
          </p>
          <p>
            <strong>I would fix the funding engine.</strong> Six engines are pure functions and
            one is not, which means the rule is a convention rather than a constraint. Nothing
            stops the next engine from reaching for the database too.
          </p>
          <p>
            <strong>I would version the model.</strong> A founder&rsquo;s plan is a document that
            changes over months, but the schema stores the current state rather than a history.
            Being able to ask &ldquo;what did this forecast look like before we changed the
            hiring plan&rdquo; is most of the value of doing it in software at all.
          </p>
        </div>
      </Chapter>

      <CaseStudyCta
        title="Happy to talk about the ones that did not work."
        note="The source is public, so everything above is checkable. I think a project that failed for a clear reason is worth more in conversation than one that quietly succeeded."
      />

      <CaseStudyFooter note="Built with a friend, whose idea it was" />
    </main>
  </>
);
