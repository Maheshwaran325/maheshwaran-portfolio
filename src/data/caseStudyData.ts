/**
 * Case study content for the institutional finance platform.
 *
 * The client is deliberately unnamed. Every figure here describes the system's
 * engineering shape (modules, tables, endpoints, tests) or outcomes already
 * published on the CV. Nothing is derived from production data.
 */

export interface Stage {
  actor: string;
  does: string;
}

export interface Chapter {
  index: string;
  label: string;
  title: string;
}

export const CASE = {
  title: 'Institutional Finance & Research Platform',
  kicker: 'Case study',
  summary:
    'A multi-tenant ERP that runs budgeting, expenditure, settlement and research operations for a 39-department engineering institution. Live for 14+ months, 330+ active users, and ₹43.4 Cr of budget processed through workflows I designed and built.',
  meta: [
    { k: 'Role', v: 'Architect and lead engineer' },
    { k: 'Team', v: 'Small team, founder-led' },
    { k: 'Period', v: '2024 — present' },
    { k: 'Status', v: '14+ months in production' },
  ],
  stack: [
    'React',
    'TypeScript',
    'Node.js',
    'Express',
    'MySQL',
    'CASL',
    'JWT',
    'Google OAuth',
    'Azure MSAL',
    'Vitest',
  ],
};

export const SCALE = [
  { v: '₹43.4 Cr', l: 'Budget processed', s: 'across 1,000+ proposals' },
  { v: '330+', l: 'Active users', s: 'across 39 departments' },
  { v: '570+', l: 'Finance requests', s: 'advances, claims, settlements' },
  { v: '14 mo', l: 'In production', s: 'continuously, no rewrite' },
];

export const BUILD = [
  { v: '288', l: 'REST endpoints', s: 'across 23 route modules' },
  { v: '118', l: 'MySQL tables', s: '33 forward migrations' },
  { v: '18', l: 'Domain modules', s: 'budget, finance, journal, events…' },
  { v: '35', l: 'Test suites', s: 'workflow, claims, auth, rollups' },
];

/** The approval chain. Roles are configured per institution, not hardcoded. */
export const STAGES: Stage[] = [
  { actor: 'Originator', does: 'Raises a proposal against a budget head' },
  { actor: 'Department head', does: 'Verifies scope and available balance' },
  { actor: 'Finance', does: 'Checks heads, ceilings and prior commitments' },
  { actor: 'Sanctioning authority', does: 'Approves, returns or rejects with reason' },
];

export const CHAPTERS: Chapter[] = [
  { index: '01', label: 'Context', title: 'Paper forms moving crores.' },
  { index: '02', label: 'Approval engine', title: 'One engine, many workflows.' },
  { index: '03', label: 'Access control', title: 'Roles the institution owns.' },
  { index: '04', label: 'Data model', title: 'Money needs an audit trail.' },
  { index: '05', label: 'Outcome', title: 'What it does now.' },
  { index: '06', label: 'Retrospective', title: 'What I would change.' },
];
