import { api } from '@/http/api-client'

export type GetTokensByAuthenticatedUserResponse = Array<{
  id: string
  token: string
  revoked: boolean
  device: string | null
  ipAddress: string | null
  createdAt: string
  expiresAt: string
  userId: string
}>

export async function getTokensByAuthenticatedUser() {
  const result = await api
    .get('sessions/tokens')
    .json<GetTokensByAuthenticatedUserResponse>()

  return result
}
