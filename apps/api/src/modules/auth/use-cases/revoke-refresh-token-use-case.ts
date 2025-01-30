import { prisma } from '@/lib/prisma'

import { RefreshTokenNotFoundError } from './_errors/refresh-token-not-found-error'

type RevokeRefreshTokenUseCaseRequest = {
  refreshTokenId: string
  userId: string
}

type RevokeRefreshTokenUseCaseResponse = void

export class RevokeRefreshTokenUseCase {
  public async execute(
    request: RevokeRefreshTokenUseCaseRequest,
  ): Promise<RevokeRefreshTokenUseCaseResponse> {
    const { refreshTokenId, userId } = request

    const refreshToken = await prisma.refreshToken.findUnique({
      where: {
        id: refreshTokenId,
      },
    })

    if (!refreshToken) {
      throw new RefreshTokenNotFoundError()
    }

    if (refreshToken.userId !== userId) {
      throw new RefreshTokenNotFoundError()
    }

    await prisma.refreshToken.update({
      where: {
        id: refreshTokenId,
      },
      data: {
        revoked: true,
      },
    })
  }
}
