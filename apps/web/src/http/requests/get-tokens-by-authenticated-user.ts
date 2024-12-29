import { api } from '@/http/api-client'

export type GetTokensByAuthenticatedUserResponse = Array<{
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

export async function getTokensByAuthenticatedUser() {
  const result = await api
    .get('sessions/tokens')
    .json<GetTokensByAuthenticatedUserResponse>()

  return result
}
