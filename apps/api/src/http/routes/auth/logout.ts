import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { FastifyTypedInstance } from '@/types/fastify'

export async function logout(app: FastifyTypedInstance) {
  app.get(
    '/sessions/logout',
    {
      schema: {
        operationId: 'logout',
        tags: ['Auth'],
        summary: 'Logout',
        response: {
          200: z.never(),
        },
      },
    },
    async (request, reply) => {
      const currentRefreshToken = request.cookies.refreshToken

      if (!currentRefreshToken) {
        return reply.clearCookie('refreshToken').status(200).send()
      }

      try {
        const { sub: refreshTokenId } = app.jwt.verify<{ sub: string }>(
          currentRefreshToken,
        )

        await prisma.refreshToken.update({
          where: {
            id: refreshTokenId,
          },
          data: {
            revoked: true,
          },
        })
      } catch (error) {
        console.log(error)
      }

      return reply.clearCookie('refreshToken').status(200).send()
    },
  )
}
