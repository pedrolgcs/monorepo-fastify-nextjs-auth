import { faker } from '@faker-js/faker'
import { expect, test } from '@playwright/test'
import { makeAccessToken } from 'tests/api/make-access-token'
import { resetAccessByUser } from 'tests/api/reset-access-by-user'

test.describe('[USER]', () => {
  let token: string
  const email = faker.internet.email()

  test.beforeAll(async () => {
    const user = await makeAccessToken(email)
    token = user.token
  })

  test.afterAll(async () => {
    await resetAccessByUser(email)
  })

  test('should be able to update user profile', async ({ browser }) => {
    const browserContext = await browser.newContext()

    await browserContext.addCookies([
      {
        name: 'token',
        value: token,
        domain: 'localhost',
        path: '/',
      },
    ])

    const page = await browserContext.newPage()

    await page.goto('/', {
      waitUntil: 'networkidle',
    })

    await page.getByRole('button', { name: 'Editar Perfil' }).click()

    await page.locator('input[name="name"]').fill('John Doe')

    await page.locator('input[name="profession"]').fill('Software Engineer')

    await page.getByRole('button', { name: 'Update profile' }).click()

    await page.getByRole('button', { name: 'Close' }).click()

    await expect(page.getByText('John Doe')).toBeVisible()

    await expect(page.getByText('Software Engineer')).toBeVisible()

    await page.waitForTimeout(1000)
  })
})
