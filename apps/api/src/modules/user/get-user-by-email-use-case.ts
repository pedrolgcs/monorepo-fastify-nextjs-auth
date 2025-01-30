import { prisma } from '@/lib/prisma'

import { BadRequestError } from './_errors/bad-request-error'

type GetUserByEmailUseCaseRequest = {
  email: string
}

type GetUserByEmailUseCaseResponse = {
  user: {
    email: string
    id: string
    name: string | null
    profession: string | null
    updatedAt: Date
    createdAt: Date
  }
}

export class GetUserByEmailUseCase {
  async execute(
    params: GetUserByEmailUseCaseRequest,
  ): Promise<GetUserByEmailUseCaseResponse> {
    const { email } = params

    const user = await prisma.user.findUnique({
      where: {
        email,
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
