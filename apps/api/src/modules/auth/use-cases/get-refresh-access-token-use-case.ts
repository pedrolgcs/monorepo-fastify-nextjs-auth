import { prisma } from '@/lib/prisma'

import { RefreshTokenNotFoundError } from './_errors/refresh-token-not-found-error'
import { UserNotFoundError } from './_errors/user-not-found-error'

type GetRefreshAccessTokenUseCaseRequest = {
  refreshTokenId: string
}

type GetRefreshAccessTokenUseCaseResponse = {
  refreshToken: {
    id: string
    token: string
    revoked: boolean
    device: string | null
    expiresAt: Date
    ipAddress: string | null
    createdAt: Date
  }
  user: {
    id: string
  }
}

export class GetRefreshAccessTokenUseCase {
  public async execute(
    request: GetRefreshAccessTokenUseCaseRequest,
  ): Promise<GetRefreshAccessTokenUseCaseResponse> {
    const { refreshTokenId } = request

    const refreshToken = await prisma.refreshToken.findUnique({
      where: {
        id: refreshTokenId,
      },
    })

    if (!refreshToken || refreshToken.revoked) {
      throw new RefreshTokenNotFoundError()
    }

    const user = await prisma.user.findUnique({
      where: {
        id: refreshToken.userId,
      },
    })

    if (!user) {
      throw new UserNotFoundError()
    }

    return {
      refreshToken,
      user: {
        id: user.id,
      },
    }
  }
}
