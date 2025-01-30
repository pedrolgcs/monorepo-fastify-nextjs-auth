import dayjs from '@/lib/day-js'
import { prisma } from '@/lib/prisma'

import { OptCodeExpiredError } from './_errors/opt-code-expired-error'
import { OptCodeNotFoundError } from './_errors/opt-code-not-found-error'

type GetOptCodeUseCaseRequest = {
  code: string
}

type GetOptCodeUseCaseResponse = {
  code: {
    code: string
    id: string
    email: string
    expiresAt: Date
    ipAddress: string | null
    createdAt: Date
  }
}

export class GetOptCodeUseCase {
  async execute(
    request: GetOptCodeUseCaseRequest,
  ): Promise<GetOptCodeUseCaseResponse> {
    const { code } = request

    const optCode = await prisma.optCode.findUnique({
      where: {
        code,
      },
    })

    if (!optCode) {
      throw new OptCodeNotFoundError()
    }

    const now = dayjs()

    if (now.isAfter(optCode.expiresAt)) {
      throw new OptCodeExpiredError()
    }

    return {
      code: optCode,
    }
  }
}
