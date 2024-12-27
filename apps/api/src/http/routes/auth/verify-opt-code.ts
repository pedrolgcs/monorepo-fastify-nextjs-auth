import crypto from 'node:crypto'

import { z } from 'zod'

import { BadRequestError } from '@/http/_errors/bad-request-error'
import dayjs from '@/lib/day-js'
import { prisma } from '@/lib/prisma'
import { FastifyTypedInstance } from '@/types/fastify'
import { getBrowserDevice } from '@/utils/browser-device'

const bodySchema = z.object({
  code: z.string(),
})

export async function verifyOPTCode(app: FastifyTypedInstance) {
  app.post(
    '/sessions/verify',
    {
      schema: {
        operationId: 'verifyOPTCode',
        tags: ['Auth'],
        summary: 'Verify OPT code',
        body: bodySchema,
        response: {
          200: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body

      const optCode = await prisma.optCode.findUnique({
        where: {
          code,
        },
      })

      if (!optCode) {
        throw new BadRequestError('invalid credentials.')
      }

      if (optCode.usedAt) {
        throw new BadRequestError('code has been used.')
      }

      const now = dayjs()

      if (now.isAfter(optCode.expiresAt)) {
        throw new BadRequestError('code has been expired.')
      }

      const user = await prisma.user.findUnique({
        where: {
          email: optCode.email,
        },
      })

      if (!user) {
        throw new BadRequestError('invalid credentials.')
      }

      await prisma.optCode.update({
        where: {
          code,
        },
        data: {
          usedAt: now.toDate(),
        },
      })

      const refreshTokenId = crypto.randomUUID()

      const [token, refreshToken] = await Promise.all([
        reply.jwtSign(
          {},
          {
            sign: {
              sub: user.id,
              expiresIn: '15m',
            },
          },
        ),

        reply.jwtSign(
          {},
          {
            sign: {
              sub: refreshTokenId,
              expiresIn: '7d',
            },
          },
        ),
      ])

      await prisma.refreshToken.create({
        data: {
          id: refreshTokenId,
          token: refreshToken,
          expiresAt: dayjs().add(7, 'day').toDate(),
          ipAddress: request.ip,
          userId: user.id,
          device: getBrowserDevice(request.headers['user-agent']).name,
        },
      })

      return reply
        .status(200)
        .setCookie('refreshToken', refreshToken, {
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          httpOnly: true,
        })
        .send({
          token,
        })
    },
  )
}
