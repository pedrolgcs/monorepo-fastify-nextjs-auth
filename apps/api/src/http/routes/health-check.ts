import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function healthCheck(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/health-check',
    {
      schema: {
        operationId: 'healthCheck',
        tags: ['App'],
        summary: 'Health check',
        response: {
          200: z.object({
            status: z.string(),
            info: z.any(),
          }),
        },
      },
    },
    async (_, reply) => {
      const addressInfo = app.server.address()

      return reply.status(200).send({
        status: 'ok',
        info: addressInfo,
      })
    },
  )
}
