import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { GetUserByIdUseCase } from '@/modules/user/get-user-by-id-use-case'

export async function getUserProfile(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/me',
    {
      onRequest: [verifyJWT],
      schema: {
        security: [{ bearerAuth: [] }],
        operationId: 'getProfile',
        tags: ['User'],
        summary: 'Get profile',
        response: {
          200: z.object({
            id: z.string(),
            name: z.string().optional().nullable(),
            email: z.string().email(),
            profession: z.string().optional().nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { sub: userId } = request.user

      const getUserByIdUseCase = new GetUserByIdUseCase()

      const { user } = await getUserByIdUseCase.execute({ id: userId })

      return reply.status(200).send({
        id: user.id,
        name: user.name,
        email: user.email,
        profession: user.profession,
      })
    },
  )
}
