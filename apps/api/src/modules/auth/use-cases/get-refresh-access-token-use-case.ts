import { prisma } from '@/lib/prisma'

import { UnauthorizedError } from './_errors/unauthorized-error'

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
      throw new UnauthorizedError(
        'refresh token is either missing, invalid, or expired.',
      )
    }

    const user = await prisma.user.findUnique({
      where: {
        id: refreshToken.userId,
      },
    })

    if (!user) {
      throw new UnauthorizedError('invalid credentials.')
    }

    return {
      refreshToken,
      user: {
        id: user.id,
      },
    }
  }
}
