import { z } from 'zod'

import { verifyStagingToken } from '@/http/middlewares/verify-staging-token'
import { prisma } from '@/lib/prisma'
import { FastifyTypedInstance } from '@/types/fastify'

const bodySchema = z.object({
  email: z.string().email(),
})

const headerSchema = z.object({
  'x-staging-token': z.string(),
})

export async function clearAccessByUser(app: FastifyTypedInstance) {
  app.post(
    '/sandbox/clear-access-by-user',
    {
      onRequest: [verifyStagingToken],
      schema: {
        operationId: 'clearAccessByUser',
        tags: ['Sandbox'],
        summary: 'Clear access by user',
        body: bodySchema,
        headers: headerSchema,
        response: {
          200: z.never(),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body

      await prisma.user.delete({
        where: {
          email,
        },
      })

      return reply.status(204).send()
    },
  )
}
