import { z } from 'zod'

import { verifyStagingToken } from '@/http/middlewares/verify-staging-token'
import dayjs from '@/lib/day-js'
import { prisma } from '@/lib/prisma'
import { FastifyTypedInstance } from '@/types/fastify'
import { generateOPTCode } from '@/utils/generate-opt-code'

const bodySchema = z.object({
  email: z.string().email(),
})

const headerSchema = z.object({
  'x-staging-token': z.string(),
})

export async function generateOptCode(app: FastifyTypedInstance) {
  app.post(
    '/sandbox/generate-opt-code',
    {
      onRequest: [verifyStagingToken],
      schema: {
        operationId: 'generateOptCode',
        tags: ['Sandbox'],
        summary: 'Generate OPT code',
        body: bodySchema,
        headers: headerSchema,
        response: {
          200: z.object({
            code: z.string(),
          }),
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

      const { code } = await prisma.optCode.create({
        data: {
          email,
          code: generateOPTCode(),
          expiresAt: dayjs().add(1, 'day').toDate(),
          ipAddress: request.ip,
        },
      })

      return reply.status(200).send({
        code,
      })
    },
  )
}
