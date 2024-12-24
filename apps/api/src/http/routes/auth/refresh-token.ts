import { z } from 'zod'

import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
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
      const currentRefreshToken = request.cookies.refreshToken

      if (!currentRefreshToken) throw new UnauthorizedError()

      let userId = ''

      try {
        const { sub } = app.jwt.verify<{ sub: string }>(currentRefreshToken)
        userId = sub
      } catch {
        throw new UnauthorizedError()
      }

      const token = await reply.jwtSign({
        sign: {
          sub: userId,
          expiresIn: '15m',
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
