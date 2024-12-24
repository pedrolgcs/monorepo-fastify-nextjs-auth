import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { verifyJWT } from '../middlewares/verify-jwt'

export async function organization(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/organizations',
    {
      onRequest: [verifyJWT],
      schema: {
        operationId: 'organization',
        tags: ['Organization'],
        summary: 'List organizations',
        response: {
          200: z.object({
            status: z.string(),
          }),
        },
      },
    },
    async (_, reply) => {
      return reply.status(200).send({
        status: 'ok',
      })
    },
  )
}
