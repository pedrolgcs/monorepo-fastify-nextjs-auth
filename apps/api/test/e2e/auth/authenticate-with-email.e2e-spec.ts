import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/http/app'

describe('[Auth] - Authenticate with e-mail', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to request a new OPT code', async () => {
    const sut = await request(app.server).post('/sessions/email').send({
      email: 'pedro@gmail.com',
    })

    expect(sut.statusCode).toEqual(200)
  })
})
