import dayjs from '@/lib/day-js'
import { prisma } from '@/lib/prisma'

type GetTokensByUserUseCaseRequest = {
  userId: string
  page: number
  pageSize: number
}

type GetTokensByUserUseCaseResponse = {
  tokens: Array<{
    id: string
    token: string
    revoked: boolean
    device: string | null
    ipAddress: string | null
    expiresAt: Date
    isExpired: boolean
    createdAt: Date
    status: 'active' | 'disabled'
  }>
  meta: {
    currentPage: number
    totalPages: number
    pageSize: number
    totalCount: number
  }
}

export class GetTokensByUserUseCase {
  public async execute(
    request: GetTokensByUserUseCaseRequest,
  ): Promise<GetTokensByUserUseCaseResponse> {
    const { userId, page, pageSize } = request

    const totalItems = await prisma.refreshToken.count({
      where: {
        userId,
      },
    })

    const userTokens = await prisma.refreshToken.findMany({
      where: {
        userId,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: [
        { revoked: 'asc' },
        {
          expiresAt: 'desc',
        },
      ],
    })

    const now = dayjs()

    const tokens = userTokens.map((token) => {
      const tokenHasExpired = dayjs(token.expiresAt).isBefore(now)

      const status: 'active' | 'disabled' =
        tokenHasExpired || token.revoked ? 'disabled' : 'active'

      return {
        id: token.id,
        token: token.token,
        revoked: token.revoked,
        device: token.device,
        ipAddress: token.ipAddress,
        expiresAt: token.expiresAt,
        isExpired: tokenHasExpired,
        createdAt: token.createdAt,
        status,
      }
    })

    return {
      tokens,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / pageSize),
        pageSize,
        totalCount: totalItems,
      },
    }
  }
}
