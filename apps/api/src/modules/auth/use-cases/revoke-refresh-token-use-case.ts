import { prisma } from '@/lib/prisma'

import { UnauthorizedError } from './_errors/unauthorized-error'

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
      throw new UnauthorizedError(
        'refresh token is either missing, invalid, or expired.',
      )
    }

    if (refreshToken.userId !== userId) {
      throw new UnauthorizedError(
        "refresh token doesn't belong to the current user.",
      )
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
