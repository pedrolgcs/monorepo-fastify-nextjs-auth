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
      const tokensByAuthenticatedUserKey: UseGetTokensByAuthenticatedUserQueryKey =
        [GET_TOKENS_BY_AUTHENTICATED_USER_QUERY_KEY]

      queryClient.setQueriesData<GetTokensByAuthenticatedUserResponse>(
        {
          queryKey: tokensByAuthenticatedUserKey,
          exact: true,
        },
        (cache) => {
          if (!cache) return

          const updatedCache = cache.map((token) => {
            if (token.id === variables.refreshTokenId) {
              return {
                ...token,
                revoked: true,
              }
            }

            return token
          })

          return updatedCache
        },
      )
    },
  })
}
