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
    const ky = (await import('ky')).default

    await page.goto('/auth/verify', {
      waitUntil: 'networkidle',
    })

    const { code } = await ky
      .create({ credentials: 'include' })
      .post('http://localhost:3333/sandbox/generate-opt-code', {
        json: { email: 'johndoe@gmail.com' },
      })
      .json<{ code: string }>()

    await page.locator('input[name="code"]').fill(code)

    await page.waitForTimeout(1000)
  })
})
