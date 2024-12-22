import { Prisma } from '@prisma/client'
import { z } from 'zod'

import dayjs from '@/lib/day-js'
import { prisma } from '@/lib/prisma'
import { FastifyTypedInstance } from '@/types/fastify'
import { generateOPTCode } from '@/utils/generate-opt-code'
import { retryUntilSuccess } from '@/utils/retry-until-success'

import { MaxRetriesWhenGenerateOPTCodeError } from '../_errors/max-retries-when-generate-opt-code'

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
          200: z.never(),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body

      try {
        await retryUntilSuccess<void>(async () => {
          await prisma.oPTCode.create({
            data: {
              email,
              code: generateOPTCode(),
              expiresAt: dayjs().add(1, 'hour').toDate(),
              ipAddress: request.ip,
            },
          })
        }, 3)
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          console.log(error.code)

          if (error.code === 'P2002') {
            throw new MaxRetriesWhenGenerateOPTCodeError()
          }
        }

        throw error
      }

      return reply.status(200).send()
    },
  )
}
