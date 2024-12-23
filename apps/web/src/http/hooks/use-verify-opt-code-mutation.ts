import { useMutation } from '@tanstack/react-query'

import {
  verifyAuthenticationCode,
  VerifyAuthenticationCodeRequest,
} from '../requests/verify-authentication-code'

export function useVerifyOptCodeMutation() {
  return useMutation({
    mutationFn: (params: VerifyAuthenticationCodeRequest) =>
      verifyAuthenticationCode(params),
  })
}
