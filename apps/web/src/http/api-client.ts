import { env } from '@repo/env'
import ky, { type HTTPError } from 'ky'

import { KEYS } from '@/constants/cookies-key'
import { deleteCookie, getCookie, getCookies, setCookie } from '@/lib/cookies'

export type RefreshTokenResponse = {
  token: string
}

let isRefreshing = false
let refreshTokenPromise: Promise<void> | null = null

const refreshAccessToken = async () => {
  try {
    const { token } = await ky
      .create({ credentials: 'include' })
      .patch(`${env.NEXT_PUBLIC_API_URL}/sessions/refresh`)
      .json<RefreshTokenResponse>()

    await setCookie(KEYS.TOKEN, token)
  } catch (error) {
    await ky
      .create({ credentials: 'include' })
      .get(`${env.NEXT_PUBLIC_API_URL}/sessions/logout`)

    deleteCookie(KEYS.TOKEN)

    if (typeof window !== 'undefined') {
      window.location.assign('/auth/sign-in')
    }

    throw error
  } finally {
    isRefreshing = false
    refreshTokenPromise = null
  }
}

export const api = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
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
          if (isRefreshing) {
            if (refreshTokenPromise) {
              await refreshTokenPromise
            }

            const token = await getCookie(KEYS.TOKEN)

            if (token) {
              request.headers.set('Authorization', `Bearer ${token}`)
              return ky(request)
            }

            return response
          }

          isRefreshing = true
          refreshTokenPromise = refreshAccessToken()

          await refreshTokenPromise

          const token = await getCookie(KEYS.TOKEN)

          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`)
            return ky(request)
          }

          return response
        }

        return response
      },
    ],
    beforeError: [
      async (error): Promise<HTTPError<{ message: string }>> => {
        const { response } = error
        const contentType = response.headers.get('content-type')

        if (contentType?.indexOf('application/json') !== -1) {
          const errorResponse = await response.json<{ message: string }>()
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
