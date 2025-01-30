import crypto from 'node:crypto'

import { z } from 'zod'

import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import dayjs from '@/lib/day-js'
import { CreateRefreshTokenUseCase } from '@/modules/auth/use-cases/create-refresh-token-use-case'
import { GetRefreshAccessTokenUseCase } from '@/modules/auth/use-cases/get-refresh-access-token-use-case'
import { FastifyTypedInstance } from '@/types/fastify'
import { getBrowserDevice } from '@/utils/browser-device'

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

      let refreshTokenId = ''
      let refreshTokenToBeSent = currentRefreshToken

      try {
        const { sub } = app.jwt.verify<{ sub: string }>(currentRefreshToken)
        refreshTokenId = sub
      } catch {
        throw new UnauthorizedError(
          'refresh token is either missing, invalid, or expired.',
        )
      }

      const getRefreshTokenUseCase = new GetRefreshAccessTokenUseCase()

      const { refreshToken, user } = await getRefreshTokenUseCase.execute({
        refreshTokenId,
      })

      const now = dayjs()

      const expirationTimeIsLessOneDay =
        dayjs(refreshToken.expiresAt).diff(now, 'day') <= 1

      if (expirationTimeIsLessOneDay) {
        const newRefreshTokenId = crypto.randomUUID()

        refreshTokenToBeSent = await reply.jwtSign(
          {},
          {
            sign: {
              sub: newRefreshTokenId,
              expiresIn: '7d',
            },
          },
        )

        const createRefreshTokenUseCase = new CreateRefreshTokenUseCase()

        await createRefreshTokenUseCase.execute({
          tokenId: newRefreshTokenId,
          token: refreshTokenToBeSent,
          userId: user.id,
          userAgent: getBrowserDevice(request.headers['user-agent']).name,
          ipAddress: request.ip,
        })
      }

      const token = await reply.jwtSign(
        {},
        {
          sign: {
            sub: user.id,
            expiresIn: '15m',
          },
        },
      )

      return reply
        .status(200)
        .setCookie('refreshToken', refreshTokenToBeSent, {
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
