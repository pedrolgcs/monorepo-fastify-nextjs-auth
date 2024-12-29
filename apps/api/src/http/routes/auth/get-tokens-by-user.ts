import { z } from 'zod'

import { verifyJWT } from '@/http/middlewares/verify-jwt'
import dayjs from '@/lib/day-js'
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
              expiresAt: z.date(),
              isExpired: z.boolean(),
              status: z.literal('active').or(z.literal('disabled')),
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
        orderBy: [
          { revoked: 'asc' },
          {
            expiresAt: 'desc',
          },
        ],
      })

      const now = dayjs()

      const payload = userTokens.map((token) => {
        const tokenHasExpired = dayjs(token.expiresAt).isBefore(now)

        const status: 'active' | 'disabled' =
          tokenHasExpired || token.revoked ? 'disabled' : 'active'

        return {
          id: token.id,
          token: token.token,
          revoked: token.revoked,
          device: token.device,
          ipAddress: token.ipAddress,
          expiresAt: token.expiresAt,
          isExpired: tokenHasExpired,
          createdAt: token.createdAt,
          status,
        }
      })

      return reply.status(200).send(payload)
    },
  )
}
