import { useQuery } from '@tanstack/react-query'

import { getProfile } from '../requests/get-profile'

export const USE_GET_PROFILE_QUERY_KEY = 'profile'

export type UseGetProfileQueryKey = [typeof USE_GET_PROFILE_QUERY_KEY]

export function useGetProfile() {
  const key: UseGetProfileQueryKey = [USE_GET_PROFILE_QUERY_KEY]

  return useQuery({
    queryKey: key,
    queryFn: () => getProfile(),
    staleTime: Infinity,
  })
}
