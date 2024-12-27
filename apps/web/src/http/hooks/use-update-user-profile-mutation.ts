import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { GetUserProfileResponse } from '../requests/get-user-profile'
import {
  updateUserProfile,
  UpdateUserProfileRequest,
} from '../requests/update-user-profile'
import {
  USE_GET_USER_PROFILE_QUERY_KEY,
  type UseGetUserProfileQueryKey,
} from './use-get-user-profile'

export function useUpdateUserProfileMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: UpdateUserProfileRequest) => updateUserProfile(params),
    onSuccess(_, variables) {
      const userProfileKey: UseGetUserProfileQueryKey = [
        USE_GET_USER_PROFILE_QUERY_KEY,
      ]

      queryClient.setQueriesData<GetUserProfileResponse>(
        {
          queryKey: userProfileKey,
          exact: true,
        },
        (cache) => {
          if (!cache) return

          return {
            ...cache,
            name: variables.name,
            profession: variables.profession,
          }
        },
      )
    },
  })
}
