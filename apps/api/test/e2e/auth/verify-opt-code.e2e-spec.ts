import request from 'supertest'
import { makeOptCode } from 'test/factories/make-opt-code'
import { makeUser } from 'test/factories/make-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/http/app'

describe('[Auth] - Authenticate with e-mail', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to verify the OPT code and create a new session', async () => {
    await makeUser()

    const optCode = await makeOptCode()

    const sut = await request(app.server).post('/sessions/verify').send({
      code: optCode.code,
    })

    const cookies = sut.get('Set-Cookie')

    expect(cookies).toBeDefined()

    expect(cookies?.some((cookie) => cookie.startsWith('refreshToken='))).toBe(
      true,
    )

    expect(sut.body).toHaveProperty('token')

    expect(sut.statusCode).toEqual(200)
  })
})
