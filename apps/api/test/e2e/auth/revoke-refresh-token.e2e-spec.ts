import request from 'supertest'
import { makeOptCode } from 'test/factories/make-opt-code'
import { makeUser } from 'test/factories/make-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/http/app'

describe('[Auth] - Revoke refresh token', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to revoke refresh token', async () => {
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

    const { id } = sessions.body.tokens[0]

    const sut = await request(app.server)
      .patch(`/sessions/tokens/${id}/revoke`)
      .set('Authorization', `Bearer ${token}`)

    expect(sut.statusCode).toEqual(200)
  })
})
