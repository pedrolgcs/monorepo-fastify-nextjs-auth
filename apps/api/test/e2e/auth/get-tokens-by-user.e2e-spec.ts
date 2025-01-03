import request from 'supertest'
import { makeOptCode } from 'test/factories/make-opt-code'
import { makeUser } from 'test/factories/make-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/http/app'

describe('[Auth] - Get tokens by user', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get tokens by user', async () => {
    await makeUser()

    const optCode = await makeOptCode()

    const {
      body: { token },
    } = await request(app.server).post('/sessions/verify').send({
      code: optCode.code,
    })

    const sut = await request(app.server)
      .get('/sessions/tokens')
      .set('Authorization', `Bearer ${token}`)
    expect(sut.body.tokens).toHaveLength(1)

    expect(sut.body.tokens).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          token: expect.any(String),
        }),
      ]),
    )

    expect(sut.statusCode).toEqual(200)
  })
})
