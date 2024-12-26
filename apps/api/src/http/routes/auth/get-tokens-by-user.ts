import { z } from 'zod'

import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { prisma } from '@/lib/prisma'
import { FastifyTypedInstance } from '@/types/fastify'

export async function getTokensByUser(app: FastifyTypedInstance) {
  app.get(
    '/sessions/tokens',
    {
      onRequest: [verifyJWT],
      schema: {
        security: [{ bearerAuth: [] }],
        operationId: 'getTokensByUser',
        tags: ['Auth'],
        summary: 'List tokens by user',
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              token: z.string(),
              revoked: z.boolean(),
              device: z.string().nullable(),
              ipAddress: z.string().nullable(),
              createdAt: z.date(),
            }),
          ),
        },
      },
    },
    async (request, reply) => {
      const { sub: userId } = request.user

      const userTokens = await prisma.refreshToken.findMany({
        where: {
          userId,
        },
      })

      return reply.status(200).send(userTokens)
    },
  )
}
