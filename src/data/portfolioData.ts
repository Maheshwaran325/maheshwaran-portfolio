/**
 * Single source of truth for portfolio content.
 * Every external URL here was verified reachable on 2026-09-12.
 */

export interface ProjectLink {
  label: string;
  href: string;
  primary?: boolean;
}

export interface Project {
  index: string;
  title: string;
  period: string;
  status?: string;
  statusLive?: boolean;
  tagline: string;
  highlights: string[];
  stack: string[];
  links: ProjectLink[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  isCurrent?: boolean;
  achievements: string[];
  stack: string[];
}

export interface StackGroup {
  key: string;
  items: string[];
}

export interface Credential {
  kind: string;
  title: string;
  detail: string;
  meta: string;
  href?: string;
}

export const PERSONAL = {
  name: 'Maheshwaran A K',
  role: 'AI-native full-stack engineer',
  location: 'Salem, Tamil Nadu, India',
  phone: '+91 96778 05622',
  phoneHref: 'tel:+919677805622',
  email: 'maheshwaran325@gmail.com',
  status: 'Available for work',
  company: 'Bipolar Factory',
  github: 'https://github.com/Maheshwaran325',
  linkedin: 'https://www.linkedin.com/in/maheshwaranak',
  x: 'https://x.com/gingfreecss325',
  resume: '/Maheshwaran-A-K-Resume.pdf',
} as const;

export const NAV = [
  { label: 'work', href: '#work' },
  { label: 'projects', href: '#projects' },
  { label: 'stack', href: '#stack' },
  { label: 'credentials', href: '#credentials' },
  { label: 'contact', href: '#contact' },
] as const;

export const METRICS = [
  { value: '₹43.4 Cr', label: 'Budget processed', sub: '1,000+ proposals via my ERP' },
  { value: '330+', label: 'Active users', sub: 'across 39 departments' },
  { value: '14 mo', label: 'In production', sub: 'multi-tenant ERP' },
  { value: 'IEEE', label: 'Published research', sub: 'AI recruitment, 2023' },
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    company: 'Bipolar Factory',
    role: 'AI-Native Full-Stack Developer',
    period: 'Sept 2025 — Present',
    location: 'Remote',
    isCurrent: true,
    achievements: [
      'Building the front end and APIs for the enterprise retail-analytics command center, turning the output of the platform\u2019s AI systems into <strong>footfall heatmaps, demographics and ANPR views</strong> that store operators can act on.',
      'Built an end-to-end <strong>workflow and scheduling system</strong> on FastAPI + PostgreSQL covering recurring, one-off and milestone schedules, TAT cascades, KPI aggregation and manager approval flows.',
      'Implemented <strong>multi-tenant object storage</strong> and evidence upload on S3/MinIO with file validation, size limits, workspace-level isolation and secure reference checks.',
      'Shipped React/TypeScript features across video-management and retail-analytics products: ticketing, KPI cards, camera grids, activity search, floor plans and NVR/device integrations.',
      'Published a reusable <strong>MUI + Recharts dashboard library</strong> — KPI cards, footfall heatmaps, widget filters, custom tooltips — as an internal npm package documented in Storybook.',
      'Refactored a <strong>100+ file legacy codebase</strong>, clearing build and lint failures while standardising on TypeScript and Redux Toolkit.',
      'Wired a Next.js analytics dashboard to live backend APIs via Orval-generated typed clients, with shared filtering, SSR fixes, dark mode and responsive charts.',
    ],
    stack: ['React', 'TypeScript', 'Next.js', 'FastAPI', 'PostgreSQL', 'Redux Toolkit', 'S3 / MinIO', 'Orval', 'MUI', 'Recharts', 'Storybook'],
  },
  {
    company: 'Statix.pro',
    role: 'Founder & Full-Stack Engineer',
    period: 'Apr 2023 — Jun 2025',
    location: 'Tamil Nadu',
    achievements: [
      'Founded the company and took multiple AI-powered SaaS products <strong>0 → 1</strong>, including Guide2Profit, the Statix.pro company site and a research-paper database system.',
      'Architected, built and deployed products spanning financial modelling, SEO automation and academic content management.',
      'Developed microservice-based backend APIs in Node.js and owned full product cycles — REST API design, cloud deployment and LLM integration.',
      'Enforced modular codebases with Git-based CI/CD and OAuth/Auth0 authentication.',
    ],
    stack: ['Node.js', 'React', 'Express', 'PostgreSQL', 'Supabase', 'LLM APIs', 'Auth0', 'CI/CD'],
  },
  {
    company: 'Infoview Technologies',
    role: 'Web Development Intern',
    period: 'Jul 2022 — Oct 2022',
    location: 'Tamil Nadu',
    achievements: [
      'Delivered a full-stack blog management system with custom authentication.',
      'Applied MVC architecture with JWT sessions and a cross-browser compatible UI.',
      'Focused on backend API logic, middleware security and CRUD functionality.',
    ],
    stack: ['JavaScript', 'Node.js', 'Express', 'JWT', 'MVC'],
  },
];

export const PROJECTS: Project[] = [
  {
    index: '01',
    title: 'Institutional Finance & Research Platform',
    period: '2024 — present',
    status: 'In production',
    statusLive: true,
    tagline:
      'A multi-tenant college ERP running budgeting, expenditure and research operations for 330+ users across 39 departments — live for 14+ months.',
    highlights: [
      'A <strong>9-role RBAC approval engine</strong> driving multi-stage budget, finance and expenditure workflows — 1,000+ proposals worth ₹43.4 Cr.',
      'End-to-end finance workflows across <strong>570+ requests</strong>: advances, bill reconciliation, settlements and audit trails.',
      'Node.js/Express + MySQL backend and React/TypeScript frontend spanning <strong>15+ business domains</strong>.',
      'JWT/OAuth authentication with CASL-based permissions for fine-grained, role-specific access.',
    ],
    stack: ['React', 'TypeScript', 'Node.js', 'Express', 'MySQL', 'JWT', 'OAuth', 'CASL'],
    links: [{ label: 'Read the case study', href: '/work/institutional-platform', primary: true }],
  },
  {
    index: '02',
    title: 'Guide2Profit',
    period: '2024',
    status: 'Shelved',
    statusLive: false,
    tagline:
      'A financial-modelling SaaS that lets founders forecast five years out — P&L, break-even and funding requirements — without a spreadsheet.',
    highlights: [
      'Multi-step form flow feeding backend-triggered financial calculation engines over REST APIs.',
      'Dynamic dashboards for <strong>5-year forecasts, P&L statements, break-even analysis</strong> and funding estimation.',
      'Built on a clean monolithic architecture with functional programming patterns.',
      'Automated deploys through Vercel + GitHub CI/CD.',
      'Shelved after validation: founders delegate financial modelling rather than doing it \u2014 the write-up covers why.',
    ],
    stack: ['React', 'Node.js', 'Express', 'Supabase', 'PostgreSQL', 'Vercel'],
    links: [
      { label: 'Read the post-mortem', href: '/work/guide2profit', primary: true },
      { label: 'Source', href: 'https://github.com/Maheshwaran325/guidetoprofit' },
    ],
  },
  {
    index: '03',
    title: 'Multi-Agent AI Debate Platform',
    period: '2025',
    status: 'Open source',
    tagline:
      'Two LLM agents argue a topic to resolution — structured argument generation, rebuttal and conflict resolution driven by prompt chaining and function calling.',
    highlights: [
      'Autonomous multi-agent reasoning loop with structured argument generation and conflict resolution.',
      'Function calling and structured outputs through the <strong>Nebius AI Studio</strong> API.',
      'Streamlit frontend streaming debates live on any user-supplied topic.',
    ],
    stack: ['Python', 'Streamlit', 'Nebius AI Studio', 'Function calling', 'Prompt chaining'],
    links: [
      { label: 'Source', href: 'https://github.com/Maheshwaran325/Nebius-Debate-AI', primary: true },
    ],
  },
  {
    index: '04',
    title: 'Statix.pro — Company Site',
    period: '2023 — 2025',
    status: 'Live',
    statusLive: true,
    tagline:
      'The business website for the company I founded — its public face for AI and digital-marketing work.',
    highlights: [
      'Designed and built the marketing site end to end: positioning, service pages and enquiry capture.',
      'Responsive React front end deployed on Vercel with Git-based CI/CD.',
    ],
    stack: ['React', 'Vercel'],
    links: [{ label: 'Live site', href: 'https://statix-pro.vercel.app/', primary: true }],
  },
];

export const STACK: StackGroup[] = [
  { key: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Redux Toolkit', 'MUI', 'Recharts', 'Storybook', 'Streamlit'] },
  { key: 'Backend', items: ['Node.js', 'Express', 'Python', 'FastAPI', 'Flask', 'Django', 'REST APIs', 'Orval'] },
  { key: 'AI & Agents', items: ['LangChain', 'LangGraph', 'LangFuse', 'HuggingFace', 'GPT APIs', 'Nebius AI Studio', 'Function calling', 'Gradio'] },
  { key: 'Data', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Supabase'] },
  { key: 'Platform', items: ['Vercel', 'GitHub Actions', 'CI/CD', 'S3 / MinIO', 'Hostinger'] },
  { key: 'Auth & Access', items: ['JWT', 'OAuth', 'Auth0', 'CASL', 'RBAC'] },
  {
    key: 'AI coding',
    items: [
      'Claude Code', 'Cursor', 'OpenCode', 'Cline', 'Antigravity',
      'Codex', 'Gemini CLI', 'Lovable', 'Bolt.new', 'Grok', 'cto.new',
    ],
  },
];

export const CREDENTIALS: Credential[] = [
  {
    kind: 'Publication',
    title: 'On-Demand Job-Based Recruitment for Organisations Using Artificial Intelligence',
    detail: 'Peer-reviewed research on AI-driven recruitment matching, algorithmic scoring and automated candidate evaluation.',
    meta: 'IEEE · 25 May 2023',
    href: 'https://ieeexplore.ieee.org/document/10127551',
  },
  {
    kind: 'Certification',
    title: 'HuggingFace AI Agents Course',
    detail: 'Completed by building and testing an autonomous agent that cleared the GAIA Level 1 benchmark.',
    meta: 'HuggingFace · May 2025',
    href: 'https://drive.google.com/file/d/1-RUkDoaaeAQ0DSVUoXaXeg3eDVcrYhsU/view?usp=drive_link',
  },
  {
    kind: 'Education',
    title: 'B.Tech, Information Technology',
    detail: 'K.S. Rangasamy College of Technology.',
    meta: '2019 — 2023 · CGPA 8.67 / 10',
  },
];
