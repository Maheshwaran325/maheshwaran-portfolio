import { expect, test } from '@playwright/test'

/** Behaviour that only exists once the bundle has hydrated. */

test('the nav résumé button opens the page, not a download', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Résumé' }).first().click()

  await expect(page).toHaveURL(/\/resume\/$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Maheshwaran A K')
  // The file is still one click away for anyone who wants it.
  await expect(page.getByRole('link', { name: 'PDF' })).toHaveAttribute(
    'href',
    '/Maheshwaran-A-K-Resume.pdf',
  )
})

test('the changelog lists real commits, newest first', async ({ page }) => {
  await page.goto('/changelog/')

  const entries = page.locator('.cl-entry')
  await expect(entries.first()).toBeVisible()
  expect(await entries.count()).toBeGreaterThan(5)

  // Every entry links to the commit it describes.
  const href = await entries.first().getAttribute('href')
  expect(href).toMatch(/github\.com\/Maheshwaran325\/maheshwaran-portfolio\/commit\/[0-9a-f]{7,}$/)

  const shas = await page.locator('.cl-sha').allTextContents()
  expect(new Set(shas).size, 'a commit is listed twice').toBe(shas.length)
})

test('copying the email address reports success', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'clipboard permissions are Chromium-specific')
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])

  await page.goto('/')
  await page.getByRole('button', { name: 'Copy address' }).click()

  await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    'maheshwaran325@gmail.com',
  )
})

test('hovering an internal link prefetches it', async ({ page, isMobile }) => {
  test.skip(isMobile, 'there is no hover to act on')

  await page.goto('/')
  await expect(page.locator('link[rel="prefetch"]')).toHaveCount(0)

  await page.getByRole('link', { name: 'Read the case study' }).first().hover()

  await expect(
    page.locator('link[rel="prefetch"][href$="/work/institutional-platform/"]'),
  ).toHaveCount(1)

  // Hovering again must not queue the same document twice.
  await page.getByRole('link', { name: 'Read the case study' }).first().hover()
  await expect(page.locator('link[rel="prefetch"]')).toHaveCount(1)
})

test('the résumé prints as ink on white, with nothing blank', async ({ page }) => {
  await page.goto('/resume/')
  await page.emulateMedia({ media: 'print' })

  // The reveal animation leaves elements at opacity 0 until the observer
  // reaches them, and printing never scrolls — so without the print override
  // the sheet comes out empty. This is the assertion that catches that.
  const opacity = await page
    .locator('.log-row')
    .last()
    .evaluate((el) => getComputedStyle(el).opacity)
  expect(opacity).toBe('1')

  await expect(page.locator('.cs-bar')).toBeHidden()
  await expect(page.locator('.proj-links').first()).toBeHidden()

  const ink = await page.evaluate(() => {
    const s = getComputedStyle(document.body)
    return { bg: s.backgroundColor, fg: s.color }
  })
  expect(ink.bg).toBe('rgb(255, 255, 255)')
  expect(ink.fg).toBe('rgb(0, 0, 0)')
})

test('reduced motion still shows every section', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  await expect(page.locator('#work')).toBeVisible()
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll('.rise')].filter(
      (el) => getComputedStyle(el).opacity === '0',
    ).length,
  )
  expect(hidden).toBe(0)
})
