import { z } from 'zod'

import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { RevokeRefreshTokenUseCase } from '@/modules/auth/use-cases/revoke-refresh-token-use-case'
import { FastifyTypedInstance } from '@/types/fastify'

export async function logout(app: FastifyTypedInstance) {
  app.get(
    '/sessions/logout',
    {
      onRequest: [verifyJWT],
      schema: {
        security: [{ bearerAuth: [] }],
        operationId: 'logout',
        tags: ['Auth'],
        summary: 'Logout',
        response: {
          200: z.never(),
        },
      },
    },
    async (request, reply) => {
      const { sub: userId } = request.user

      const currentRefreshToken = request.cookies.refreshToken

      if (!currentRefreshToken) {
        return reply.clearCookie('refreshToken').status(200).send()
      }

      // TODO: Move from middleware
      const { sub: refreshTokenId } = app.jwt.verify<{ sub: string }>(
        currentRefreshToken,
      )

      const revokeRefreshTokenUseCase = new RevokeRefreshTokenUseCase()

      await revokeRefreshTokenUseCase.execute({
        refreshTokenId,
        userId,
      })

      return reply.clearCookie('refreshToken').status(200).send()
    },
  )
}
