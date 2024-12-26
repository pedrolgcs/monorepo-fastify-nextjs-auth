import { api } from '@/http/api-client'

export type SignInWithEmailRequest = {
  email: string
}

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
