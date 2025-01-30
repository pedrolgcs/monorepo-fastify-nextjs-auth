import dayjs from '@/lib/day-js'
import { prisma } from '@/lib/prisma'

import { BadRequestError } from './_errors/bad-request-error'

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
      throw new BadRequestError('code not found.')
    }

    const now = dayjs()

    if (now.isAfter(optCode.expiresAt)) {
      throw new BadRequestError('code has been expired.')
    }

    return {
      code: optCode,
    }
  }
}
