import type { z } from 'zod'

import { api } from '@/http/api-client'

import { revokeRefreshTokenParams } from '../generated/orval/auth'

export type RevokeRefreshTokenRequest = z.infer<typeof revokeRefreshTokenParams>

export type RevokeRefreshTokenResponse = void

export async function revokeRefreshToken(params: RevokeRefreshTokenRequest) {
  const { id } = params

  const result = await api
    .patch(`sessions/tokens/${id}/revoke`)
    .json<RevokeRefreshTokenResponse>()

  return result
}
