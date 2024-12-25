import { api } from '@/http/api-client'

export type RefreshTokenResponse = {
  token: string
}

export async function refreshAccessToken() {
  const result = await api
    .patch('sessions/refresh')
    .json<RefreshTokenResponse>()

  return result
}
