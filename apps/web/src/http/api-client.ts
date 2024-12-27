import ky, { type HTTPError } from 'ky'

import { API_BASE_URL } from '@/constants/api'
import { KEYS } from '@/constants/cookies-key'
import { deleteCookie, getCookie, getCookies, setCookie } from '@/lib/cookies'

export type RefreshTokenResponse = {
  token: string
}

// auxiliar variables
let isRefreshing = false
let refreshTokenPromise: Promise<void> | null = null

const refreshAccessToken = async () => {
  try {
    const { token } = await ky
      .create({ credentials: 'include' })
      .patch(`${API_BASE_URL}/sessions/refresh`)
      .json<RefreshTokenResponse>()

    await setCookie(KEYS.TOKEN, token)
  } catch (error) {
    await ky
      .create({ credentials: 'include' })
      .get(`${API_BASE_URL}/sessions/logout`)

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
          // await if there is a refresh token request in progress.
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

          // set isRefreshing to true and start the refresh token request.
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
