import crypto from 'node:crypto'

import { z } from 'zod'

import { CreateRefreshTokenUseCase } from '@/modules/auth/use-cases/create-refresh-token-use-case'
import { GetOptCodeUseCase } from '@/modules/auth/use-cases/get-opt-code-use-case'
import { GetUserByEmailUseCase } from '@/modules/user/get-user-by-email-use-case'
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

      const getOptCodeUseCase = new GetOptCodeUseCase()

      const { code: optCode } = await getOptCodeUseCase.execute({ code })

      const getUserByEmailUseCase = new GetUserByEmailUseCase()

      const { user } = await getUserByEmailUseCase.execute({
        email: optCode.email,
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

      const createRefreshTokenUseCase = new CreateRefreshTokenUseCase()

      await createRefreshTokenUseCase.execute({
        tokenId: refreshTokenId,
        userId: user.id,
        token: refreshToken,
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
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
