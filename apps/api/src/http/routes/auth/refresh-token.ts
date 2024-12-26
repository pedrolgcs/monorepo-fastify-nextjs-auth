import crypto from 'node:crypto'

import { z } from 'zod'

import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import dayjs from '@/lib/day-js'
import { prisma } from '@/lib/prisma'
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

      const refreshToken = await prisma.refreshToken.findUnique({
        where: {
          id: refreshTokenId,
        },
      })

      if (!refreshToken || refreshToken.revoked) {
        throw new UnauthorizedError(
          'refresh token is either missing, invalid, or expired.',
        )
      }

      const user = await prisma.user.findUnique({
        where: {
          id: refreshToken.userId,
        },
      })

      if (!user) {
        throw new UnauthorizedError('invalid credentials.')
      }

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

        await prisma.refreshToken.create({
          data: {
            id: newRefreshTokenId,
            token: refreshTokenToBeSent,
            userId: user.id,
            expiresAt: dayjs().add(7, 'day').toDate(),
            device: request.headers['user-agent'],
            ipAddress: request.ip,
          },
        })
      }

      const token = await reply.jwtSign(
        {},
        {
          sign: {
            sub: user.id,
            expiresIn: '1m',
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
