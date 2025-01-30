import { z } from 'zod'

import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { GetTokensByUserUseCase } from '@/modules/auth/use-cases/get-tokens-by-user-use-case'
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

      const getTokensByUserUseCase = new GetTokensByUserUseCase()

      const { tokens, meta } = await getTokensByUserUseCase.execute({
        userId,
        page,
        pageSize,
      })

      return reply.status(200).send({
        tokens,
        meta,
      })
    },
  )
}
