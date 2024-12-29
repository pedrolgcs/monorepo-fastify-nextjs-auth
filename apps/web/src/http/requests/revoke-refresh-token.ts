import { api } from '@/http/api-client'

export type RevokeRefreshTokenRequest = {
  refreshTokenId: string
}

export type RevokeRefreshTokenResponse = void

export async function revokeRefreshToken(params: RevokeRefreshTokenRequest) {
  const { refreshTokenId } = params

  const result = await api
    .patch(`sessions/tokens/${refreshTokenId}/revoke`)
    .json<RevokeRefreshTokenResponse>()

  return result
}
