import { expect, test } from '@playwright/test'

test.describe('[AUTH]', () => {
  test.afterEach(async ({ page }) => {
    await page.waitForTimeout(1000)
  })

  test('should be able to request a OPT code', async ({ page }) => {
    await page.goto('/auth/sign-in', {
      waitUntil: 'networkidle',
    })

    await page.locator('input[name="email"]').fill('johndoe@gmail.com')
    await page.getByRole('button', { name: 'sign in with e-mail' }).click()

    await page.waitForURL('**/auth/verify')

    await expect(page.getByText('Verify your code').nth(0)).toBeVisible()
  })

  test('should be able to authenticate with OPT', async ({ page }) => {
    await page.goto('/auth/verify', {
      waitUntil: 'networkidle',
    })

    const { code } = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/sandbox/generate-opt-code`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-staging-token': `${process.env.STAGING_API_TOKEN}`,
        },
        body: JSON.stringify({ email: 'johndoe@gmail.com' }),
      },
    ).then((response) => response.json())

    await page.locator('input[name="code"]').fill(code)

    await page.waitForTimeout(1000)
  })
})
