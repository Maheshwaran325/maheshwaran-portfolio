/**
 * Case study content for Guide2Profit.
 *
 * The concept and the financial model came from a founder; my work was turning
 * that model into a system. Every figure below describes the repository —
 * modules, engines, screens, files — and is checkable against the public
 * source. There are no usage or revenue numbers here because I have none to
 * verify.
 */
import type { ChapterMeta } from '../components/CaseStudyParts';

export const CASE = {
  title: 'Guide2Profit — Startup Financial Modelling',
  kicker: 'Case study',
  summary:
    'A financial-modelling SaaS that replaces a founder’s spreadsheet. Startup costs, payroll, operations and a funding plan go in; five-year sales forecasts, P&L, break-even, COGS and funding requirements come out — with a Gemini assistant that explains the model but is forbidden from doing the arithmetic.',
  meta: [
    { k: 'Role', v: 'Architect and sole engineer' },
    { k: 'Origin', v: 'A founder’s concept, built at Statix.pro' },
    { k: 'Period', v: 'Aug — Sep 2024' },
    { k: 'Status', v: 'Live, source public' },
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
  live: 'https://cashcompassclient-git-main-maheshwaran325s-projects.vercel.app/',
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
  { index: '05', label: 'Outcome', title: 'What actually shipped.' },
  { index: '06', label: 'Retrospective', title: 'What I would change.' },
];
