import { z } from 'zod'

import { FastifyTypedInstance } from '@/types/fastify'

export async function refreshToken(app: FastifyTypedInstance) {
  app.patch(
    '/sessions/refresh',
    {
      schema: {
        operationId: 'refreshToken',
        tags: ['Auth'],
        summary: 'Refresh token',
        response: {
          200: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      await request.jwtVerify({ onlyCookie: true })

      const { sub: userId } = request.user

      const token = await reply.jwtSign({
        sign: {
          sub: userId,
        },
      })

      const refreshToken = await reply.jwtSign(
        {},
        {
          sign: {
            sub: userId,
            expiresIn: '7d',
          },
        },
      )

      return reply
        .status(200)
        .setCookie('refreshToken', refreshToken, {
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: true,
          httpOnly: true,
        })
        .send({
          token,
        })
    },
  )
}
