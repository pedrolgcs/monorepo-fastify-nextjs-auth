import { z } from 'zod'

import { verifyStagingToken } from '@/http/middlewares/verify-staging-token'
import dayjs from '@/lib/day-js'
import { prisma } from '@/lib/prisma'
import { FastifyTypedInstance } from '@/types/fastify'

const bodySchema = z.object({
  email: z.string().email(),
  agent: z.string(),
})

const headerSchema = z.object({
  'x-staging-token': z.string(),
})

export async function signIn(app: FastifyTypedInstance) {
  app.post(
    '/sandbox/sign-in',
    {
      onRequest: [verifyStagingToken],
      schema: {
        operationId: 'signIn',
        tags: ['Sandbox'],
        summary: 'Sign in',
        body: bodySchema,
        headers: headerSchema,
        response: {
          200: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, agent } = request.body

      const user = await prisma.user.upsert({
        where: {
          email,
        },
        update: {
          email,
        },
        create: {
          email,
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
          device: agent,
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
