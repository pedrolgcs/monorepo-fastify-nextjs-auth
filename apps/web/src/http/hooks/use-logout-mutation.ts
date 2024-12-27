import { useMutation } from '@tanstack/react-query'

import { logout } from '../requests/logout'

export function useLogoutMutation() {
  return useMutation({
    mutationFn: () => logout(),
  })
}
