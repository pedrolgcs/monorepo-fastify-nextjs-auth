import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { GetTokensByAuthenticatedUserResponse } from '../requests/get-tokens-by-authenticated-user'
import {
  revokeRefreshToken,
  RevokeRefreshTokenRequest,
} from '../requests/revoke-refresh-token'
import {
  GET_TOKENS_BY_AUTHENTICATED_USER_QUERY_KEY,
  type UseGetTokensByAuthenticatedUserQueryKey,
} from './use-get-tokens-by-authenticated-user'

export function useRevokeRefreshTokenMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: RevokeRefreshTokenRequest) =>
      revokeRefreshToken(params),
    onSuccess(_, variables) {
      const tokensByAuthenticatedUserKey: Partial<UseGetTokensByAuthenticatedUserQueryKey> =
        [GET_TOKENS_BY_AUTHENTICATED_USER_QUERY_KEY]

      const ordersListCache =
        queryClient.getQueriesData<GetTokensByAuthenticatedUserResponse>({
          queryKey: tokensByAuthenticatedUserKey,
        })

      ordersListCache.forEach((cached) => {
        const [key, data] = cached

        if (!data) return null

        queryClient.setQueryData<GetTokensByAuthenticatedUserResponse>(key, {
          ...data,
          tokens: data.tokens.map((token) => {
            if (token.id === variables.refreshTokenId) {
              return {
                ...token,
                revoked: true,
                status: 'disabled' as const,
              }
            }

            return token
          }),
        })
      })
    },
  })
}
