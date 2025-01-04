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
    const user = await makeUser()

    const optCode = await makeOptCode()

    const {
      body: { token },
    } = await request(app.server).post('/sessions/verify').send({
      code: optCode.code,
    })

    const sut = await request(app.server)
      .put(`/users/${user.id}`)
      .send({
        name: 'John Doe',
        profession: 'Developer',
      })
      .set('Authorization', `Bearer ${token}`)

    expect(sut.statusCode).toEqual(204)
  })
})
