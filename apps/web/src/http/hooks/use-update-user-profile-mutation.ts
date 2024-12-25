import { useMutation } from '@tanstack/react-query'

import {
  updateUserProfile,
  UpdateUserProfileRequest,
} from '../requests/update-user-profile'

export function useUpdateUserProfileMutation() {
  return useMutation({
    mutationFn: (params: UpdateUserProfileRequest) => updateUserProfile(params),
  })
}
