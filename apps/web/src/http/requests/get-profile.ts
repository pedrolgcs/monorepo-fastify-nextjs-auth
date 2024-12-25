import { api } from '@/http/api-client'

export type VerifyAuthenticationCodeResponse = {
  id: string
  email: string
  name?: string
  profession?: string
}

export async function getProfile() {
  const result = await api.get('me').json<VerifyAuthenticationCodeResponse>()

  return result
}
