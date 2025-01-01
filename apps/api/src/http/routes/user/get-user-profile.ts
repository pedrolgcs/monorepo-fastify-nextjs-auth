import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { BadRequestError } from '@/http/_errors/bad-request-error'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { prisma } from '@/lib/prisma'

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

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      })

      if (!user) {
        throw new BadRequestError('user not found')
      }

      return reply.status(200).send({
        id: user.id,
        name: user.name,
        email: user.email,
        profession: user.profession,
      })
    },
  )
}
