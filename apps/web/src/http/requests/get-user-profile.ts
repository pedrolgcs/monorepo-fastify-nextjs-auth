import type { z } from 'zod'

import { api } from '@/http/api-client'

import { getProfileResponse } from '../generated/orval/user'

export type GetUserProfileResponse = z.infer<typeof getProfileResponse>

export async function getUserProfile() {
  const result = await api.get('me').json<GetUserProfileResponse>()

  return result
}
