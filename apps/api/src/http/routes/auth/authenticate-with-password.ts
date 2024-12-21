import { z } from 'zod'

import { FastifyTypedInstance } from '@/types/fastify'

const bodySchema = z.object({
  email: z.string().email(),
})

export async function authenticateWithPassword(app: FastifyTypedInstance) {
  app.post(
    '/sessions/password',
    {
      schema: {
        operationId: 'authenticateWithPassword',
        tags: ['Auth'],
        summary: 'Authenticate with e-mail and password',
        body: bodySchema,
        response: {
          201: z.object({
            email: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body

      return reply.status(200).send({
        email,
      })
    },
  )
}
