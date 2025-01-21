import { faker } from '@faker-js/faker'
import { expect, test } from '@playwright/test'
import { makeOptCode } from 'tests/api/make-opt-code'
import { resetAccessByUser } from 'tests/api/reset-access-by-user'

test.describe('[AUTH]', () => {
  const email = faker.internet.email()

  test.afterAll(async () => {
    await resetAccessByUser(email)
  })

  test('should be able to request a OPT code', async ({ page }) => {
    await page.goto('/auth/sign-in', {
      waitUntil: 'networkidle',
    })

    await page.locator('input[name="email"]').fill(email)
    await page.getByRole('button', { name: 'sign in with e-mail' }).click()

    await page.waitForURL('**/auth/verify')

    await expect(page.getByText('Verify your code').nth(0)).toBeVisible()
  })

  test('should be able to authenticate with OPT', async ({ page }) => {
    await page.goto('/auth/verify', {
      waitUntil: 'networkidle',
    })

    const { code } = await makeOptCode(email)

    await page.locator('input[name="code"]').fill(code)

    await page.waitForTimeout(1000)
  })
})
