import { HTTPError } from 'ky'
import { createSafeActionClient } from 'next-safe-action'

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    if (e instanceof HTTPError) {
      return e.message
    }

    return 'An unknown error occurred! Please, try again.'
  },
})
