import { faker } from '@faker-js/faker'
import { expect, test } from '@playwright/test'
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
    makeAccessToken(email, 'chrome'),
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

  test('should be able to list first page of access tokens', async ({
    browser,
  }) => {
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

    const rows = await page.locator(
      '[data-testid="access-tokens-table"] tbody tr',
    )

    const rowCount = await rows.count()

    expect(rowCount).toBe(5)

    await page.waitForTimeout(1000)
  })

  test('should be able to navigate between pages', async ({ browser }) => {
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

    await expect(page.getByTestId('previous-page-button').nth(0)).toBeDisabled()

    await page.getByTestId('next-page-button').click()

    const secondPageRows = await page.locator(
      '[data-testid="access-tokens-table"] tbody tr',
    )

    const secondPageRowCount = await secondPageRows.count()

    expect(secondPageRowCount).toBe(2)

    await expect(page.getByTestId('previous-page-button').nth(0)).toBeEnabled()

    await page.getByTestId('previous-page-button').click()

    const firstPageRows = await page.locator(
      '[data-testid="access-tokens-table"] tbody tr',
    )

    const firstPageRowCount = await firstPageRows.count()

    expect(firstPageRowCount).toBe(5)

    await expect(page.getByTestId('previous-page-button').nth(0)).toBeDisabled()

    await expect(page.getByTestId('next-page-button').nth(0)).toBeEnabled()

    await page.waitForTimeout(1000)
  })
})
