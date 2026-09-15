import React from 'react';

/**
 * Inline SVGs so the diagrams inherit the design tokens and stay crisp.
 * Both scale with their container and stay legible down to phone width.
 *
 * Below 720px they are wider than the viewport and scroll horizontally rather
 * than shrink to illegibility (see .figure in index.css). A region that
 * scrolls has to be reachable by keyboard, or a keyboard user cannot see its
 * right-hand half at all — hence tabIndex on the figure. The figcaption names
 * it, so the tab stop announces itself.
 */

const MONO = "'JetBrains Mono', ui-monospace, monospace";

export const ApprovalDiagram: React.FC = () => (
  <figure className="figure" tabIndex={0}>
    <svg viewBox="0 0 860 250" role="img" aria-labelledby="approval-title" className="diagram">
      <title id="approval-title">
        A document moves through four ordered stages. Any stage can return it to the originator,
        which appends to its history rather than starting a new document.
      </title>

      <defs>
        <marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--line-strong)" />
        </marker>
        <marker id="ar-sig" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--signal)" />
        </marker>
      </defs>

      {[
        { x: 10, label: 'ORIGINATOR', sub: 'raises' },
        { x: 225, label: 'DEPT HEAD', sub: 'verifies' },
        { x: 440, label: 'FINANCE', sub: 'checks heads' },
        { x: 655, label: 'AUTHORITY', sub: 'sanctions' },
      ].map((n, i) => (
        <g key={n.label}>
          <rect
            x={n.x} y="60" width="195" height="70" rx="5"
            fill="var(--bg-raised)"
            stroke={i === 3 ? 'var(--signal)' : 'var(--line-strong)'}
          />
          <text x={n.x + 97} y="90" textAnchor="middle" fontFamily={MONO} fontSize="13"
            letterSpacing="1.5" fill={i === 3 ? 'var(--signal)' : 'var(--fg)'}>
            {n.label}
          </text>
          <text x={n.x + 97} y="112" textAnchor="middle" fontFamily={MONO} fontSize="11"
            fill="var(--fg-mute)">
            {n.sub}
          </text>
        </g>
      ))}

      {[205, 420, 635].map((x) => (
        <line key={x} x1={x} y1="95" x2={x + 18} y2="95"
          stroke="var(--line-strong)" strokeWidth="1.5" markerEnd="url(#ar)" />
      ))}

      {/* the return path — the bit that matters */}
      <path
        d="M 752 138 L 752 190 L 107 190 L 107 138"
        fill="none" stroke="var(--signal)" strokeWidth="1.5"
        strokeDasharray="5 4" markerEnd="url(#ar-sig)" opacity="0.85"
      />
      <text x="430" y="215" textAnchor="middle" fontFamily={MONO} fontSize="11.5"
        letterSpacing="0.5" fill="var(--signal)">
        returned — appends an event, keeps one history
      </text>
    </svg>
    <figcaption>
      Any stage can return a document. It goes back as the same record with an added event, so a
      proposal returned twice still reads as one continuous trail.
    </figcaption>
  </figure>
);

export const LayerDiagram: React.FC = () => {
  const rows = [
    { k: 'ALLOCATION', v: 'what a head was given for the year', w: 100 },
    { k: 'COMMITMENT', v: 'what approved proposals have claimed', w: 68 },
    { k: 'DISBURSEMENT', v: 'what actually left the account', w: 41 },
  ];
  return (
    <figure className="figure" tabIndex={0}>
      <svg viewBox="0 0 860 250" role="img" aria-labelledby="layer-title" className="diagram">
        <title id="layer-title">
          Allocation, commitment and disbursement are modelled separately, so available balance is
          allocation minus commitment rather than minus spend.
        </title>

        {rows.map((r, i) => {
          const y = 20 + i * 70;
          const active = i === 1;
          return (
            <g key={r.k}>
              {/* label and description share a line above the bar, so a
                  full-width bar can never push its caption off-canvas */}
              <text x="0" y={y + 20} fontFamily={MONO} fontSize="12" letterSpacing="1.2"
                fill={active ? 'var(--signal)' : 'var(--fg)'}>
                {r.k}
                <tspan fontSize="11.5" letterSpacing="0" fill="var(--fg-mute)">
                  {'   ' + r.v}
                </tspan>
              </text>
              <rect x="0" y={y + 32} width={(820 * r.w) / 100} height="22" rx="3"
                fill={active ? 'var(--signal-wash)' : 'var(--bg-raised)'}
                stroke={active ? 'var(--signal)' : 'var(--line-strong)'} />
            </g>
          );
        })}

        <line x1="0" y1="232" x2="820" y2="232" stroke="var(--line)" />
        <text x="0" y="248" fontFamily={MONO} fontSize="11.5" fill="var(--signal)">
          available = allocation − commitment   (not − disbursement)
        </text>
      </svg>
      <figcaption>
        Checking against committed rather than spent funds is what stops two proposals racing the
        same budget head from both being approved.
      </figcaption>
    </figure>
  );
};
