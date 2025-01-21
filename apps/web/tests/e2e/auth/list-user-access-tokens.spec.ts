import { faker } from '@faker-js/faker'
import { test } from '@playwright/test'
import { makeAccessToken } from 'tests/api/make-access-token'
import { resetAccessByUser } from 'tests/api/reset-access-by-user'

async function populateTable(email: string) {
  const response = await Promise.all([
    makeAccessToken(email, 'chrome'),
    makeAccessToken(email, 'firefox'),
    makeAccessToken(email, 'safari'),
    makeAccessToken(email, 'opera'),
    makeAccessToken(email, 'edge'),
    makeAccessToken(email, 'brave'),
  ])

  return response
}

test.describe('[ACCESS_TOKENS]', () => {
  let token: string
  const email = faker.internet.email()

  test.beforeAll(async () => {
    const [firstUser] = await populateTable(email)
    token = firstUser.token
  })

  test.afterAll(async () => {
    await resetAccessByUser(email)
  })

  test('should be able to list user access tokens', async ({ browser }) => {
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

    await page.waitForTimeout(1000)
  })
})
