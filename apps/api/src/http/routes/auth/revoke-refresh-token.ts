import { z } from 'zod'

import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { RevokeRefreshTokenUseCase } from '@/modules/auth/use-cases/revoke-refresh-token-use-case'
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

      const { id: refreshTokenId } = paramsSchema.parse(request.params)

      const revokeRefreshTokenUseCase = new RevokeRefreshTokenUseCase()

      await revokeRefreshTokenUseCase.execute({
        refreshTokenId,
        userId,
      })

      return reply.status(200).send()
    },
  )
}
