import ky, { type HTTPError } from 'ky'

import { refreshAccessToken } from './requests/refresh-access-token'

export const api = ky.create({
  prefixUrl: 'http://localhost:3333',
  credentials: 'include',
  hooks: {
    beforeRequest: [
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000)) // TODO: remove
      },
    ],
    afterResponse: [
      async (request, _, response) => {
        if (response.status === 401) {
          const { token } = await refreshAccessToken()
          request.headers.set('Authorization', `Bearer ${token}`)
          return ky(request)
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
