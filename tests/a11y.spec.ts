import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { ROUTES } from './routes'

/**
 * The site claims WCAG AA — README puts the lowest contrast ratio at 4.66:1.
 * A claim nothing checks is a claim that decays, and contrast in particular
 * decays invisibly: a token nudged one step darker still looks fine.
 *
 * Runs on both the desktop and mobile projects, because the responsive rules
 * hide and restack enough that they are effectively different documents.
 */

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

for (const route of ROUTES) {
  test(`${route.path} has no accessibility violations`, async ({ page }) => {
    await page.goto(route.path)

    // Elements below the fold sit at opacity 0 until the reveal observer
    // reaches them, and axe composites that opacity into the colour it
    // measures — every one of them reads as failing contrast. Flipping
    // data-in is not enough either: the 0.7s transition means axe samples a
    // colour partway through the fade. Cut the animation out entirely so the
    // scan sees the page as a visitor eventually does.
    await page.addStyleTag({
      content: '.rise { opacity: 1 !important; transform: none !important; transition: none !important; }',
    })

    const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze()

    expect(
      violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`),
    ).toEqual([])
  })
}

test('the mobile menu is announced correctly', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'the burger only exists below 820px')

  await page.goto('/')
  const burger = page.getByRole('button', { name: 'Open menu' })
  await expect(burger).toHaveAttribute('aria-expanded', 'false')

  await burger.click()
  await expect(page.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
    'aria-expanded',
    'true',
  )

  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze()
  expect(violations.map((v) => v.id)).toEqual([])
})
