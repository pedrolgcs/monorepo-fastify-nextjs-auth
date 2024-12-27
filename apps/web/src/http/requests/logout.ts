import { api } from '@/http/api-client'

export async function logout() {
  const result = await api.get('sessions/logout')
  return result
}
