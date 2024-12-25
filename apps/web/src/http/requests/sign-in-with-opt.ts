import { api } from '@/http/api-client'

export type SignInWithOptRequest = {
  email: string
}

export type SignInWithOptResponse = void

export async function signInWithOpt(params: SignInWithOptRequest) {
  const { email } = params

  const result = await api
    .post('sessions/opt', {
      json: {
        email,
      },
    })
    .json<SignInWithOptResponse>()

  return result
}
