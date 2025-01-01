import type { z } from 'zod'

import { api } from '@/http/api-client'

import { authenticateWithEmailBody } from '../generated/orval/auth'

export type SignInWithEmailRequest = z.infer<typeof authenticateWithEmailBody>

export type SignInWithEmailResponse = void

export async function signInWithEmail(params: SignInWithEmailRequest) {
  const { email } = params

  const result = await api
    .post('sessions/email', {
      json: {
        email,
      },
    })
    .json<SignInWithEmailResponse>()

  return result
}
