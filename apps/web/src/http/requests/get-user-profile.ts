import { api } from '@/http/api-client'

export type GetUserProfileResponse = {
  id: string
  email: string
  name?: string
  profession?: string
}

export async function getUserProfile() {
  const result = await api.get('me').json<GetUserProfileResponse>()

  return result
}
