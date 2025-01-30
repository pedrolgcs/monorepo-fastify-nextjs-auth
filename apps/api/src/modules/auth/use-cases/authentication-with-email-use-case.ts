import { Prisma } from '@prisma/client'

import dayjs from '@/lib/day-js'
import { prisma } from '@/lib/prisma'
import type { MailProvider } from '@/providers/mail/mail-provider'
import { generateOPTCode } from '@/utils/generate-opt-code'
import { retryUntilSuccess } from '@/utils/retry-until-success'

import { MaxRetriesWhenGenerateOPTCodeError } from './_errors/max-retries-when-generate-opt-code'

type AuthenticateWithEmailUseCaseRequest = {
  email: string
  ipAddress: string
}

type AuthenticateWithEmailUseCaseResponse = void

const MAX_RETRIES_WHEN_GENERATE_OPT_CODE = 3

export class AuthenticateWithEmailUseCase {
  constructor(private readonly mailClient: MailProvider) {}

  public async execute(
    request: AuthenticateWithEmailUseCaseRequest,
  ): Promise<AuthenticateWithEmailUseCaseResponse> {
    const { email, ipAddress } = request

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
            ipAddress,
          },
        })

        this.mailClient.sendEmail({
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
      }, MAX_RETRIES_WHEN_GENERATE_OPT_CODE)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new MaxRetriesWhenGenerateOPTCodeError()
        }
      }

      throw error
    }
  }
}
