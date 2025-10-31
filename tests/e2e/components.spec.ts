import { test, expect } from '@playwright/test'

test.describe('Component Visual Tests', () => {
  test('doctor card visual snapshot', async ({ page }) => {
    await page.goto('/doctors')
    await page.waitForLoadState('networkidle')
    
    // Wait for doctor cards to load
    const doctorCard = page.locator('[data-testid="doctor-card"], .doctor-card').first()
    await doctorCard.waitFor({ state: 'visible' })
    
    await expect(doctorCard).toHaveScreenshot('doctor-card.png')
  })

  test('facility card visual snapshot', async ({ page }) => {
    await page.goto('/facilities')
    await page.waitForLoadState('networkidle')
    
    const facilityCard = page.locator('[data-testid="facility-card"], .facility-card').first()
    await facilityCard.waitFor({ state: 'visible' })
    
    await expect(facilityCard).toHaveScreenshot('facility-card.png')
  })

  test('search bar visual snapshot', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const searchBar = page.locator('input[type="search"], input[placeholder*="Search"], [data-testid="search"]').first()
    await expect(searchBar).toHaveScreenshot('search-bar.png')
  })
})

