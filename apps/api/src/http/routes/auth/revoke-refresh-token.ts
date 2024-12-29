import { z } from 'zod'

import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { prisma } from '@/lib/prisma'
import { FastifyTypedInstance } from '@/types/fastify'

const paramsSchema = z.object({
  id: z.string(),
})

export async function revokeRefreshToken(app: FastifyTypedInstance) {
  app.patch(
    '/sessions/tokens/:id/revoke',
    {
      onRequest: [verifyJWT],
      schema: {
        security: [{ bearerAuth: [] }],
        params: paramsSchema,
        operationId: 'revokeRefreshToken',
        tags: ['Auth'],
        summary: 'Revoke refresh token',
        response: {
          200: z.never(),
        },
      },
    },
    async (request, reply) => {
      const { sub: userId } = request.user

      const { id } = paramsSchema.parse(request.params)

      const refreshToken = await prisma.refreshToken.findUnique({
        where: {
          id,
        },
      })

      if (!refreshToken) {
        throw new UnauthorizedError(
          'refresh token is either missing, invalid, or expired.',
        )
      }

      if (refreshToken.userId !== userId) {
        throw new UnauthorizedError(
          "refresh token doesn't belong to the current user.",
        )
      }

      await prisma.refreshToken.update({
        where: {
          id,
        },
        data: {
          revoked: true,
        },
      })

      return reply.status(200).send()
    },
  )
}
