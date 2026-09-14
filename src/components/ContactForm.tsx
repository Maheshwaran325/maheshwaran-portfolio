import React, { useState } from 'react';
import { Send } from 'lucide-react';

type State = 'idle' | 'sending' | 'sent' | 'error';

/**
 * Netlify picks up forms by parsing the deployed HTML, which only works
 * because the build prerenders this markup — a client-only render would leave
 * it nothing to find. Submitting over fetch keeps the visitor on the page.
 */
export const ContactForm: React.FC = () => {
  const [state, setState] = useState<State>('idle');

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setState('sending');

    try {
      const body = new URLSearchParams(
        [...new FormData(form)].map(([k, v]) => [k, String(v)]),
      ).toString();

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      if (!response.ok) throw new Error(String(response.status));

      form.reset();
      setState('sent');
    } catch {
      setState('error');
    }
  };

  return (
    <form
      className="form"
      name="contact"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={onSubmit}
    >
      {/* Netlify routes the submission by this name. */}
      <input type="hidden" name="form-name" value="contact" />

      {/* Spam trap: invisible to people, irresistible to bots. */}
      <p className="hp" aria-hidden="true">
        <label>
          Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="form-row">
        <p className="field">
          <label htmlFor="cf-name">Name</label>
          <input id="cf-name" name="name" type="text" required autoComplete="name" />
        </p>
        <p className="field">
          <label htmlFor="cf-email">Email</label>
          <input id="cf-email" name="email" type="email" required autoComplete="email" />
        </p>
      </div>

      <p className="field">
        <label htmlFor="cf-message">Message</label>
        <textarea id="cf-message" name="message" rows={4} required />
      </p>

      <div className="form-foot">
        <button className="btn btn-signal btn-lg" type="submit" disabled={state === 'sending'}>
          <Send size={15} /> {state === 'sending' ? 'Sending…' : 'Send message'}
        </button>

        <p className="form-status" role="status" aria-live="polite" data-state={state}>
          {state === 'sent' && 'Thanks — I’ll reply within a day.'}
          {state === 'error' && 'That didn’t send. Email me directly instead.'}
        </p>
      </div>
    </form>
  );
};
