import { useQuery } from '@tanstack/react-query'

import { getTokensByAuthenticatedUser } from '../requests/get-tokens-by-authenticated-user'

export const GET_TOKENS_BY_AUTHENTICATED_USER_QUERY_KEY = 'user-tokens'

export type UseGetTokensByAuthenticatedUserQueryKey = [
  typeof GET_TOKENS_BY_AUTHENTICATED_USER_QUERY_KEY,
]

export function useGetTokensByAuthenticatedUser() {
  const key: UseGetTokensByAuthenticatedUserQueryKey = [
    GET_TOKENS_BY_AUTHENTICATED_USER_QUERY_KEY,
  ]

  return useQuery({
    queryKey: key,
    queryFn: () => getTokensByAuthenticatedUser(),
    staleTime: 0, // No cache
  })
}
