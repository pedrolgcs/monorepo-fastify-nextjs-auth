import { useQuery } from '@tanstack/react-query'

import {
  getTokensByAuthenticatedUser,
  GetTokensByAuthenticatedUserRequest,
} from '../requests/get-tokens-by-authenticated-user'

export const GET_TOKENS_BY_AUTHENTICATED_USER_QUERY_KEY = 'user-tokens'

export type UseGetTokensByAuthenticatedUserQueryKey = [
  typeof GET_TOKENS_BY_AUTHENTICATED_USER_QUERY_KEY,
  page: number,
  pageSize: number,
]

export function useGetTokensByAuthenticatedUser(
  params: GetTokensByAuthenticatedUserRequest,
) {
  const { page = 1, pageSize = 5 } = params

  const key: UseGetTokensByAuthenticatedUserQueryKey = [
    GET_TOKENS_BY_AUTHENTICATED_USER_QUERY_KEY,
    page,
    pageSize,
  ]

  return useQuery({
    queryKey: key,
    queryFn: () => getTokensByAuthenticatedUser({ page, pageSize }),
    staleTime: 0, // 0 seconds
  })
}
