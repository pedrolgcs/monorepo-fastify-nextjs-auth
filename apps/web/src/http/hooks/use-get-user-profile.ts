import { useQuery } from '@tanstack/react-query'

import { getUserProfile } from '../requests/get-user-profile'

export const USE_GET_USER_PROFILE_QUERY_KEY = 'profile'

export type UseGetUserProfileQueryKey = [typeof USE_GET_USER_PROFILE_QUERY_KEY]

export function useGetUserProfile() {
  const key: UseGetUserProfileQueryKey = [USE_GET_USER_PROFILE_QUERY_KEY]

  return useQuery({
    queryKey: key,
    queryFn: () => getUserProfile(),
    staleTime: Infinity,
  })
}
