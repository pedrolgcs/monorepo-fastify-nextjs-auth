import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/http/app'

describe('[App] - Health Check', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to check the health of the server', async () => {
    const response = await request(app.server).get('/health-check').send()

    expect(response.statusCode).toEqual(200)
  })
})
