import request from 'supertest'
import { makeOptCode } from 'test/factories/make-opt-code'
import { makeUser } from 'test/factories/make-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/http/app'

describe('[Auth] - Refresh access token', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh access token', async () => {
    await makeUser()

    const optCode = await makeOptCode()

    const {
      body: { token },
    } = await request(app.server).post('/sessions/verify').send({
      code: optCode.code,
    })

    const sessions = await request(app.server)
      .get('/sessions/tokens')
      .set('Authorization', `Bearer ${token}`)

    const { token: refreshToken } = sessions.body.tokens[0]

    const sut = await request(app.server)
      .patch(`/sessions/refresh`)
      .set('Cookie', `refreshToken=${refreshToken}`)

    const cookies = sut.get('Set-Cookie')

    expect(cookies?.some((cookie) => cookie.startsWith('refreshToken='))).toBe(
      true,
    )

    expect(sut.statusCode).toEqual(200)

    expect(sut.body).toEqual({
      token: expect.any(String),
    })
  })
})
