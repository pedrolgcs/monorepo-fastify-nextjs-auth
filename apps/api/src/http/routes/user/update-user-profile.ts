import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { BadRequestError } from '@/http/_errors/bad-request-error'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { prisma } from '@/lib/prisma'

const bodySchema = z.object({
  name: z.string().optional(),
  profession: z.string().optional(),
})

const paramsSchema = z.object({
  id: z.string(),
})

export async function updateUserProfile(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/users/:id',
    {
      onRequest: [verifyJWT],
      schema: {
        security: [{ bearerAuth: [] }],
        operationId: 'updateProfile',
        tags: ['User'],
        summary: 'Update profile',
        body: bodySchema,
        params: paramsSchema,
        response: {
          204: z.never(),
        },
      },
    },
    async (request, reply) => {
      const { id } = paramsSchema.parse(request.params)

      const { name, profession } = bodySchema.parse(request.body)

      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      })

      if (!user) {
        throw new BadRequestError('user not found')
      }

      await prisma.user.update({
        where: {
          id,
        },
        data: {
          name,
          profession,
        },
      })

      return reply.status(204).send()
    },
  )
}
