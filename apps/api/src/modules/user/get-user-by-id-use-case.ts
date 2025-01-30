import { prisma } from '@/lib/prisma'

import { BadRequestError } from './_errors/bad-request-error'

type GetUserByIdlUseCaseRequest = {
  id: string
}

type GetUserByIdUseCaseResponse = {
  user: {
    email: string
    id: string
    name: string | null
    profession: string | null
    updatedAt: Date
    createdAt: Date
  }
}

export class GetUserByIdUseCase {
  async execute(
    params: GetUserByIdlUseCaseRequest,
  ): Promise<GetUserByIdUseCaseResponse> {
    const { id } = params

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      throw new BadRequestError('code not found.')
    }

    return {
      user,
    }
  }
}
