import { api } from '@/http/api-client'

export type GetTokensByAuthenticatedUserRequest = {
  page: number
  pageSize: number
}

export type GetTokensByAuthenticatedUserResponse = {
  tokens: Array<{
    id: string
    token: string
    revoked: boolean
    device: string | null
    ipAddress: string | null
    createdAt: string
    expiresAt: string
    isExpired: boolean
    userId: string
    status: 'active' | 'disabled'
  }>
  meta: {
    pageSize: number
    currentPage: number
    totalPages: number
    totalCount: number
  }
}

export async function getTokensByAuthenticatedUser(
  params: GetTokensByAuthenticatedUserRequest,
) {
  const { page, pageSize } = params

  const result = await api
    .get('sessions/tokens', {
      searchParams: {
        page,
        pageSize,
      },
    })
    .json<GetTokensByAuthenticatedUserResponse>()

  return result
}
