import { setCookie } from 'cookies-next'
import ky, { type HTTPError } from 'ky'

import { API_BASE_URL } from '@/constants/api'
import { KEYS } from '@/constants/cookies-key'
import { deleteCookie, getCookie, getCookies } from '@/lib/cookies'

export type RefreshTokenResponse = {
  token: string
}

export const api = ky.create({
  prefixUrl: API_BASE_URL,
  credentials: 'include',
  retry: 0,
  hooks: {
    beforeRequest: [
      async (request) => {
        const token = await getCookie(KEYS.TOKEN)

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }

        const cookies = await getCookies()

        if (cookies) {
          const applicationCookies = Object.entries(cookies)
            .map(([key, value]) => {
              return `${key}=${value}`
            })
            .join(';')

          request.headers.set('Cookie', applicationCookies)
        }
      },
    ],
    afterResponse: [
      async (request, _, response) => {
        if (response.status === 401) {
          try {
            const { token } = await ky
              .create({ credentials: 'include', headers: request.headers })
              .patch(`${API_BASE_URL}/sessions/refresh`)
              .json<RefreshTokenResponse>()

            await setCookie(KEYS.TOKEN, token)

            request.headers.set('Authorization', `Bearer ${token}`)

            return ky(request)
          } catch (error) {
            await ky
              .create({ credentials: 'include', headers: request.headers })
              .get(`${API_BASE_URL}/sessions/logout`)

            deleteCookie(KEYS.TOKEN)

            if (typeof window !== 'undefined') {
              window.location.assign('/auth/sign-in')
            }

            return response
          }
        }

        return response
      },
    ],
    beforeError: [
      async (error): Promise<HTTPError<{ message: string }>> => {
        const { response } = error
        const contentType = response.headers.get('content-type')

        if (contentType?.indexOf('application/json') !== -1) {
          const errorResponse = await response.json<{
            message: string
          }>()
          error.message = errorResponse.message
        } else {
          const errorResponse = await response.text()
          error.message = errorResponse
        }

        return error
      },
    ],
  },
})
