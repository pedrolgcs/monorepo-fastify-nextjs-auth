import { prisma } from '@/lib/prisma'

import { UserNotFoundError } from './_errors/user-not-found-error'

type UpdateUserByIdUseCaseRequest = {
  id: string
  name?: string
  profession?: string
}

export class UpdateUserByIdUseCase {
  async execute(request: UpdateUserByIdUseCaseRequest) {
    const { id, name, profession } = request

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      throw new UserNotFoundError()
    }

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        profession,
      },
    })
  }
}
