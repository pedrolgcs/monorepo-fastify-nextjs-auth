import { z } from 'zod'

import { AuthenticateWithEmailUseCase } from '@/modules/auth/use-cases/authentication-with-email-use-case'
import { mailClient } from '@/providers/mail/index'
import { FastifyTypedInstance } from '@/types/fastify'

const bodySchema = z.object({
  email: z.string().email(),
})

export async function authenticateWithEmail(app: FastifyTypedInstance) {
  app.post(
    '/sessions/email',
    {
      schema: {
        operationId: 'authenticateWithEmail',
        tags: ['Auth'],
        summary: 'Authenticate with e-mail',
        body: bodySchema,
        response: {
          200: z.never(),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body

      const authenticateWithEmailUseCase = new AuthenticateWithEmailUseCase(
        mailClient,
      )

      await authenticateWithEmailUseCase.execute({
        email,
        ipAddress: request.ip,
      })

      return reply.status(200).send()
    },
  )
}
