import ky from 'ky'

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
      async (request, options, response) => {
        if (response.status === 403) {
          const token = await ky('https://example.com/token').text()
          request.headers.set('Authorization', `Bearer ${token}`)
          return ky(request)
        }
      },
    ],
    beforeError: [
      async (error) => {
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
