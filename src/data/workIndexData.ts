/**
 * Content for /work/ — the index the three case studies hang off.
 *
 * Organised by capability rather than by project, because a project name is
 * not something anyone searches for. Nobody types "Land2Build"; they type
 * "developer who can integrate an LLM". Each group therefore leads with the
 * problem and who has it, and treats the projects as the evidence rather than
 * the subject.
 *
 * Every figure here also appears on the case study it points at. That is the
 * point: a claim that lives on exactly one page reads as unverified, to a
 * reader and to a model.
 */

export interface Evidence {
  /** The claim, with its number. May contain <strong>. */
  claim: string;
  /** Where the claim is backed up, if it is somewhere public. */
  href?: string;
  label?: string;
  external?: boolean;
}

export interface CapabilityGroup {
  index: string;
  /** The capability in the words someone hiring for it would use. */
  title: string;
  /** Who has this problem. */
  forWho: string;
  /** Two or three sentences: the problem, and the shape of the answer. */
  body: string[];
  evidence: Evidence[];
  stack: string[];
}

export const WORK_INDEX = {
  title: 'What I build',
  kicker: 'Work',
  lede:
    'Three kinds of problem, and what I have shipped against each. If you are trying to work out whether I am the right person for something specific, this page is faster than the résumé — it leads with the problem rather than the job title.',
};

export const CAPABILITY_GROUPS: CapabilityGroup[] = [
  {
    index: '01',
    title: 'Multi-tenant systems and role-based access control',
    forWho:
      'Organisations where money, approvals or records move through more than one pair of hands — and where each department insists its own rules are different.',
    body: [
      'The failure mode is always the same. Permissions start as a handful of <strong>if</strong> statements, a second department arrives with a slightly different approval chain, and within a year the authorisation logic is spread across the codebase and nobody can change a rule without breaking an unrelated one.',
      'The answer I keep arriving at is to make roles data rather than code. One approval engine, configured per tenant, so adding a chain is configuration and not a deploy — and an audit trail underneath it that money can actually be traced through.',
    ],
    evidence: [
      {
        claim:
          'A <strong>9-role RBAC approval engine</strong> running multi-stage budget, finance and expenditure workflows for a 39-department institution.',
        href: '/work/institutional-platform/',
        label: 'Read the case study',
      },
      { claim: '<strong>₹43.4 Cr</strong> of budget processed across 1,000+ proposals.' },
      { claim: '<strong>330+ active users</strong>, and 570+ finance requests — advances, bill reconciliation, settlements.' },
      { claim: '<strong>14+ months</strong> in production and still in daily use.' },
    ],
    stack: ['React', 'TypeScript', 'Node.js', 'Express', 'MySQL', 'JWT', 'OAuth', 'CASL'],
  },
  {
    index: '02',
    title: 'Retail analytics and operational dashboards',
    forWho:
      'Teams whose AI or computer-vision systems already work, and whose operators still cannot tell what to do about the output.',
    body: [
      'A detection is not a decision. A model that counts footfall, reads a plate or estimates demographics produces a stream of events that is worthless until somebody standing in a store can look at a screen and act on it. That gap is the product layer, and it is the part I build.',
      'It is mostly unglamorous: choosing which number goes at the top, making a filter mean the same thing on every widget, and keeping a chart readable on the one screen the manager actually has.',
    ],
    evidence: [
      {
        claim:
          'The front end and APIs for an enterprise <strong>retail-analytics command center</strong> — footfall heatmaps, demographics and ANPR views, camera grids, floor plans and NVR/device integrations.',
      },
      {
        claim:
          'A reusable <strong>MUI + Recharts dashboard library</strong> — KPI cards, heatmaps, widget filters, custom tooltips — published as an internal npm package and documented in Storybook.',
      },
      {
        claim:
          'A Next.js analytics dashboard wired to live backend APIs through <strong>Orval-generated typed clients</strong>, with shared filtering, SSR fixes and responsive charts.',
      },
      {
        claim:
          'This is employer work at Bipolar Factory, so it has no public case study and no repository — the résumé has the full detail.',
        href: '/resume/',
        label: 'See the résumé',
      },
    ],
    stack: ['React', 'TypeScript', 'Next.js', 'MUI', 'Recharts', 'Storybook', 'Redux Toolkit', 'FastAPI', 'PostgreSQL', 'Orval'],
  },
  {
    index: '03',
    title: 'LLM and AI-agent integration',
    forWho:
      'Products where an LLM should do one narrow job extremely well, rather than everything approximately.',
    body: [
      'The demo-friendly way to use an <strong>LLM</strong> is to put it in charge of the output. It shows well and it is almost always the wrong call, because the output is then the one part of the system you cannot test.',
      'I build it the other way round: the model owns the <strong>input</strong> — turning what a person wrote into a typed, schema-shaped struct — and deterministic code owns everything after that. Which means the thing you ship carries invariants you can actually assert.',
    ],
    evidence: [
      {
        claim:
          'In <strong>Land2Build</strong>, an LLM parses a one-sentence building brief into a typed config; a deterministic binary space partition generates the floor plan.',
        href: '/work/land2build/',
        label: 'Read the case study',
      },
      { claim: '<strong>35 invariant checks</strong> across randomised runs and all seven house types — possible only because the model never touches the geometry.' },
      {
        claim:
          'A <strong>multi-agent debate platform</strong>: two LLM agents run structured argument, rebuttal and conflict resolution through function calling and structured outputs.',
        href: 'https://github.com/Maheshwaran325/Nebius-Debate-AI',
        label: 'Source on GitHub',
        external: true,
      },
    ],
    stack: ['Python', 'LangChain', 'LangGraph', 'LangFuse', 'Nebius AI Studio', 'Function calling', 'React', 'TypeScript'],
  },
];
