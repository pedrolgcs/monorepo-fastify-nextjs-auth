import { api } from '@/http/api-client'

export type VerifyAuthenticationCodeRequest = {
  code: string
}

export type VerifyAuthenticationCodeResponse = {
  token: string
}

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
