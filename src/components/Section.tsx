import React from 'react';

interface Props {
  id: string;
  index: string;
  label: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}

export const Section: React.FC<Props> = ({ id, index, label, title, note, children }) => (
  <section id={id} className="section">
    <div className="shell">
      <header className="sec-head rise">
        <p className="sec-index">
          <b>{index}</b> {label}
        </p>
        <h2 className="sec-title">{title}</h2>
        {note && <p className="sec-note">{note}</p>}
      </header>
      {children}
    </div>
  </section>
);
