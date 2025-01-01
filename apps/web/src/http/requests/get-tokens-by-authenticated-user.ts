import type { z } from 'zod'

import { api } from '@/http/api-client'

import {
  getTokensByUserQueryParams,
  getTokensByUserResponse,
} from '../generated/orval/auth'

export type GetTokensByAuthenticatedUserRequest = z.infer<
  typeof getTokensByUserQueryParams
>

export type GetTokensByAuthenticatedUserResponse = z.infer<
  typeof getTokensByUserResponse
>

export async function getTokensByAuthenticatedUser(
  params: GetTokensByAuthenticatedUserRequest,
) {
  const { page = 1, pageSize = 5 } = params

  const result = await api
    .get('sessions/tokens', {
      searchParams: {
        page,
        pageSize,
      },
    })
    .json<GetTokensByAuthenticatedUserResponse>()

  return result
}
