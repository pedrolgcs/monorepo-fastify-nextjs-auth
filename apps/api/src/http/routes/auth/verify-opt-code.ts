import { z } from 'zod'

import { BadRequestError } from '@/http/_errors/bad-request-error'
import dayjs from '@/lib/day-js'
import { prisma } from '@/lib/prisma'
import { FastifyTypedInstance } from '@/types/fastify'

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
        throw new BadRequestError('code not found.')
      }

      const now = dayjs()

      if (now.isAfter(optCode.expiresAt)) {
        throw new BadRequestError('code expired.')
      }

      const user = await prisma.user.findUnique({
        where: {
          email: optCode.email,
        },
      })

      let userId = user?.id || ''

      if (!user) {
        const newUser = await prisma.user.create({
          data: {
            email: optCode.email,
          },
        })

        userId = newUser.id
      }

      const token = await reply.jwtSign(
        {},
        {
          sign: {
            sub: userId,
            expiresIn: '15m',
          },
        },
      )

      const refreshToken = await reply.jwtSign(
        {},
        {
          sign: {
            sub: userId,
            expiresIn: '7d',
          },
        },
      )

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
