import { api } from '@/http/api-client'

export type SignInWithPasswordRequest = {
  email: string
}

export type SignInWithPasswordResponse = void

export async function signInWithPassword(params: SignInWithPasswordRequest) {
  const { email } = params

  const result = await api
    .post('sessions/password', {
      json: {
        email,
      },
    })
    .json<SignInWithPasswordResponse>()

  return result
}
