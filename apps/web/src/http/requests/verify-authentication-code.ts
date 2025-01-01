import type { z } from 'zod'

import { api } from '@/http/api-client'

import {
  verifyOPTCodeBody,
  verifyOPTCodeResponse,
} from '../generated/orval/auth'

export type VerifyAuthenticationCodeRequest = z.infer<typeof verifyOPTCodeBody>

export type VerifyAuthenticationCodeResponse = z.infer<
  typeof verifyOPTCodeResponse
>

export async function verifyAuthenticationCode(
  params: VerifyAuthenticationCodeRequest,
) {
  const { code } = params

  const result = await api
    .post('sessions/verify', {
      json: {
        code,
      },
    })
    .json<VerifyAuthenticationCodeResponse>()

  return result
}
