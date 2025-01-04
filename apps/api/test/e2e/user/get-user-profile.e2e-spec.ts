import request from 'supertest'
import { makeOptCode } from 'test/factories/make-opt-code'
import { makeUser } from 'test/factories/make-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/http/app'

describe('[User] - Get user profile', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
    await makeUser()

    const optCode = await makeOptCode()

    const {
      body: { token },
    } = await request(app.server).post('/sessions/verify').send({
      code: optCode.code,
    })

    const sut = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)

    expect(sut.statusCode).toEqual(200)

    expect(sut.body).toMatchObject({
      email: 'john@gmail.com',
    })
  })
})
