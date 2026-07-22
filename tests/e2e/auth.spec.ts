import { test, expect } from '@playwright/test'

test.describe('Authentication Flow E2E', () => {
  
  test('should successfully login and redirect to dashboard', async ({ page }) => {
    // 1. Navigate to login page
    await page.goto('/login')
    
    // 2. Fill credentials
    await page.fill('input[type="email"]', 'admin@jyschool.edu')
    await page.fill('input[type="password"]', 'SecurePass123!')
    
    // 3. Click submit
    await page.click('button[type="submit"]')
    
    // 4. Wait for redirect and assert Dashboard is visible
    await page.waitForURL('/dashboard')
    await expect(page.locator('h1')).toContainText('Dashboard')
    
    // 5. Assert Audit Log (Phase 26) tracked the login (mock check)
    // In a real E2E environment, you might hit a test API to verify database state.
  })

  test('should block unauthorized access to Review page', async ({ page }) => {
    // Attempt to hit the review page without logging in
    const response = await page.goto('/review')
    
    // Should be redirected back to login
    await expect(page).toHaveURL(/.*login/)
  })
})
