/**
 * Post-mortem content for Guide2Profit.
 *
 * My friend's idea and financial model; the two of us built it, me as the
 * developer. It shipped, found no market, and stopped. Every figure describes
 * the repository and is checkable against the public source. There are no
 * usage or revenue numbers because there were none.
 *
 * No live link on purpose: the Vercel frontend still serves, but the backend
 * runs on a Supabase free tier that sleeps after inactivity, so the app does
 * not work. Linking it as "live" would be false.
 */
import type { ChapterMeta } from '../components/CaseStudyParts';

export const CASE = {
  title: 'Guide2Profit — Startup Financial Modelling',
  kicker: 'Post-mortem',
  summary:
    'A financial-modelling SaaS that replaced a founder’s spreadsheet: costs, payroll and funding plans in; five-year forecasts, P&L, break-even and funding requirements out. We built it properly and it went nowhere — because founders do not want to model their own finances. This is what we built, and the conversation that ended it.',
  meta: [
    { k: 'Role', v: 'Developer — architecture and build' },
    { k: 'Origin', v: 'My friend’s idea; the two of us built it' },
    { k: 'Period', v: 'Aug — Sep 2024' },
    { k: 'Status', v: 'Shelved — no market fit' },
  ],
  stack: [
    'React',
    'Node.js',
    'Express',
    'Supabase',
    'PostgreSQL',
    'JWT',
    'Google Gemini',
    'Vercel',
  ],
  repo: 'https://github.com/Maheshwaran325/guidetoprofit',
};

export const BUILD = [
  { v: '11', l: 'Financial modules', s: '4 input, 7 output' },
  { v: '7', l: 'Calculation engines', s: 'six pure, one reaches for its model' },
  { v: '14', l: 'Client screens', s: 'forms, dashboards, glossary' },
  { v: '166', l: 'Files', s: '97 client, 68 server' },
];

/** What the founder enters before anything can be derived. */
export const INPUTS = [
  { actor: 'Startup cost', does: 'One-time spend before revenue begins' },
  { actor: 'Employee payroll', does: 'Headcount, salaries and the cost of each hire' },
  { actor: 'Operations & finance', does: 'The recurring cost base and revenue assumptions' },
  { actor: 'Funding plan', does: 'Equity and loans, and when that cash actually lands' },
];

/** What the engines derive from those inputs. */
export const OUTPUTS = [
  'Sales forecast',
  'Forecast P&L',
  'Break-even analysis',
  'COGS calculator',
  'Salaries',
  'Funding requirement',
  'Startup cost summary',
];

export const CHAPTERS: ChapterMeta[] = [
  { index: '01', label: 'Context', title: 'Someone else’s spreadsheet.' },
  { index: '02', label: 'Architecture', title: 'Inputs one side, outputs the other.' },
  { index: '03', label: 'Calculation', title: 'The maths never touches the database.' },
  { index: '04', label: 'The assistant', title: 'An LLM that may not add up.' },
  { index: '05', label: 'Why it stopped', title: 'Nobody needed it.' },
  { index: '06', label: 'Retrospective', title: 'What the failure taught me.' },
];
