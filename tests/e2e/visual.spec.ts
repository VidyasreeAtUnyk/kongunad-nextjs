import { test, expect } from '@playwright/test'

test.describe('Visual Regression Tests', () => {
  test('homepage visual snapshot', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.locator('header, nav, main').first().waitFor({ state: 'visible' })
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
    })
  })

  test('homepage hero section', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.locator('header, nav, main').first().waitFor({ state: 'visible' })
    
    // Screenshot of specific element
    const hero = page.locator('[data-testid="hero-section"], .hero, main').first()
    await expect(hero).toHaveScreenshot('homepage-hero.png')
  })

  test('navigation visual snapshot', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.locator('header, nav').first().waitFor({ state: 'visible' })
    
    const nav = page.locator('nav, header, [role="navigation"]').first()
    await expect(nav).toHaveScreenshot('navigation.png')
  })

  test('footer visual snapshot', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.locator('main').first().waitFor({ state: 'visible' })
    
    // Scroll to footer
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
    await page.waitForTimeout(500) // Wait for scroll
    
    const footer = page.locator('footer').first()
    await expect(footer).toHaveScreenshot('footer.png')
  })

  test('about-us page visual snapshot', async ({ page }) => {
    await page.goto('/about-us', { waitUntil: 'networkidle' })
    await page.locator('main').first().waitFor({ state: 'visible' })
    
    await expect(page).toHaveScreenshot('about-us.png', {
      fullPage: true,
    })
  })

  test('doctors page visual snapshot', async ({ page }) => {
    await page.goto('/doctors', { waitUntil: 'networkidle' })
    await page.locator('main').first().waitFor({ state: 'visible' })
    
    await expect(page).toHaveScreenshot('doctors.png', {
      fullPage: true,
    })
  })

  test('facilities page visual snapshot', async ({ page }) => {
    await page.goto('/facilities', { waitUntil: 'networkidle' })
    await page.locator('main').first().waitFor({ state: 'visible' })
    
    await expect(page).toHaveScreenshot('facilities.png', {
      fullPage: true,
    })
  })

  test('mobile viewport homepage', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.locator('main').first().waitFor({ state: 'visible' })
    
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
    })
  })

  test('tablet viewport homepage', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.locator('main').first().waitFor({ state: 'visible' })
    
    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
    })
  })
})

