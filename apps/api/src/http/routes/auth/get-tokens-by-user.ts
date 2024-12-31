import { z } from 'zod'

import { verifyJWT } from '@/http/middlewares/verify-jwt'
import dayjs from '@/lib/day-js'
import { prisma } from '@/lib/prisma'
import { FastifyTypedInstance } from '@/types/fastify'

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(20).default(5),
})

export async function getTokensByUser(app: FastifyTypedInstance) {
  app.get(
    '/sessions/tokens',
    {
      onRequest: [verifyJWT],
      schema: {
        security: [{ bearerAuth: [] }],
        querystring: querySchema,
        operationId: 'getTokensByUser',
        tags: ['Auth'],
        summary: 'List tokens by user',
        response: {
          200: z.object({
            tokens: z.array(
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
            meta: z.object({
              currentPage: z.number(),
              totalPages: z.number(),
              pageSize: z.number(),
              totalCount: z.number(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { sub: userId } = request.user

      const { page, pageSize } = querySchema.parse(request.query)

      const totalItems = await prisma.refreshToken.count({
        where: {
          userId,
        },
      })

      const userTokens = await prisma.refreshToken.findMany({
        where: {
          userId,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: [
          { revoked: 'asc' },
          {
            expiresAt: 'desc',
          },
        ],
      })

      const now = dayjs()

      const tokens = userTokens.map((token) => {
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

      return reply.status(200).send({
        tokens,
        meta: {
          currentPage: page,
          totalPages: Math.ceil(totalItems / pageSize),
          pageSize,
          totalCount: totalItems,
        },
      })
    },
  )
}
