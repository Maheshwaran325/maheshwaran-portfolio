/**
 * Prerender entry. AI crawlers (GPTBot, ClaudeBot, PerplexityBot) do not run
 * JavaScript, so a client-only render leaves them an empty <div id="root">.
 * The build renders each route to HTML here and the browser hydrates it.
 *
 * Fast refresh never applies to this entry — it only ever runs in the build —
 * so it exports the page data too, letting the build generate structured data
 * from the same source the page renders from.
 */
// oxlint-disable react/only-export-components
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

export { PERSONAL, EXPERIENCE, PROJECTS, FAQ, CAPABILITIES } from './data/portfolioData';

export function render(path: string): string {
  return renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>,
  );
}
