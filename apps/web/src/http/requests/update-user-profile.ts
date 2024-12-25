import { api } from '@/http/api-client'

export type UpdateUserProfileRequest = {
  id: string
  name?: string
  profession?: string
}

export type UpdateUserProfileResponse = void

export async function updateUserProfile(params: UpdateUserProfileRequest) {
  const { id, name, profession } = params

  const result = await api
    .put(`users/${id}`, {
      json: {
        name,
        profession,
      },
    })
    .json<UpdateUserProfileResponse>()

  return result
}
