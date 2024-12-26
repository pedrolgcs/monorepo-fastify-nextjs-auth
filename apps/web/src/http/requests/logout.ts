import { api } from '@/http/api-client'

export type LogoutResponse = void

export async function logout() {
  const result = await api.get('sessions/logout').json<LogoutResponse>()

  return result
}
