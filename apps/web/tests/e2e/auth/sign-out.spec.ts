import { faker } from '@faker-js/faker'
import { expect, test } from '@playwright/test'
import { makeAccessToken } from 'tests/api/make-access-token'
import { resetAccessByUser } from 'tests/api/reset-access-by-user'

test.describe('[AUTH]', () => {
  let token: string
  const email = faker.internet.email()

  test.beforeAll(async () => {
    const user = await makeAccessToken(email)
    token = user.token
  })

  test.afterAll(async () => {
    await resetAccessByUser(email)
  })

  test('should be able to sign out', async ({ browser }) => {
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

    await page.getByTestId('log-out-button').click()

    await page.getByRole('button', { name: 'continue' }).click()

    await page.waitForURL('**/auth/sign-in')

    expect(page.url()).toContain('/auth/sign-in')

    await page.waitForTimeout(1000)
  })
})
