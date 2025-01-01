import type { z } from 'zod'

import { api } from '@/http/api-client'

import { updateProfileBody, updateProfileParams } from '../generated/orval/user'

export type UpdateUserProfileRequest = z.infer<typeof updateProfileBody> &
  z.infer<typeof updateProfileParams>

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
