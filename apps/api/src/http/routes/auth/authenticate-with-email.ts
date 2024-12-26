import { Prisma } from '@prisma/client'
import { z } from 'zod'

import { MaxRetriesWhenGenerateOPTCodeError } from '@/http/_errors/max-retries-when-generate-opt-code'
import dayjs from '@/lib/day-js'
import { prisma } from '@/lib/prisma'
import { resendMailClient } from '@/providers/mail/resend'
import { FastifyTypedInstance } from '@/types/fastify'
import { generateOPTCode } from '@/utils/generate-opt-code'
import { retryUntilSuccess } from '@/utils/retry-until-success'

const MAX_RETRIES_WHEN_GENERATE_OPT_CODE = 3

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

      await prisma.user.upsert({
        where: {
          email,
        },
        update: {},
        create: {
          email,
        },
      })

      try {
        await retryUntilSuccess<void>(async () => {
          const { code } = await prisma.optCode.create({
            data: {
              email,
              code: generateOPTCode(),
              expiresAt: dayjs().add(1, 'day').toDate(),
              ipAddress: request.ip,
            },
          })

          if (process.env.NODE_ENV === 'production') {
            resendMailClient.sendEmail({
              to: {
                email: ['delivered@resend.dev'],
              },
              subject: 'OPT Code',
              template: {
                file: 'send-opt-code',
                variables: {
                  code,
                },
              },
            })
          }
        }, MAX_RETRIES_WHEN_GENERATE_OPT_CODE)
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
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
