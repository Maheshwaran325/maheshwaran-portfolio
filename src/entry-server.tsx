/**
 * Prerender entry. AI crawlers (GPTBot, ClaudeBot, PerplexityBot) do not run
 * JavaScript, so a client-only render leaves them an empty <div id="root">.
 * The build renders each route to HTML here and the browser hydrates it.
 */
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

export function render(path: string): string {
  return renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>,
  );
}
