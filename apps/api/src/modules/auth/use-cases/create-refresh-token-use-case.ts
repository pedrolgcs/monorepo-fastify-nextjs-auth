import dayjs from '@/lib/day-js'
import { prisma } from '@/lib/prisma'
import { getBrowserDevice } from '@/utils/browser-device'

type CreateRefreshTokenUseCaseRequest = {
  tokenId?: string
  userId: string
  token: string
  ipAddress: string
  userAgent?: string
}

type CreateRefreshTokenUseCaseResponse = {
  id: string
}

export class CreateRefreshTokenUseCase {
  public async execute(
    request: CreateRefreshTokenUseCaseRequest,
  ): Promise<CreateRefreshTokenUseCaseResponse> {
    const { tokenId, userId, token, ipAddress, userAgent } = request

    const refreshToken = await prisma.refreshToken.create({
      data: {
        id: tokenId,
        token,
        userId,
        expiresAt: dayjs().add(7, 'day').toDate(),
        device: getBrowserDevice(userAgent).name,
        ipAddress,
      },
    })

    return {
      id: refreshToken.id,
    }
  }
}
