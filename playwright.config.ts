import { defineConfig, devices } from '@playwright/test'

/**
 * Tests run against the production build, never the dev server.
 *
 * Almost everything worth guarding here only exists after `npm run build`:
 * the prerendered HTML each route is served as, the inlined stylesheet, the
 * sitemap, and the 404. A dev-server suite would pass while the thing that
 * actually ships was broken — which is the failure this exists to catch.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],

  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],

  webServer: {
    // Build as part of starting the server so the suite can never run against
    // a stale dist/ — the build is a couple of seconds.
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173/',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
