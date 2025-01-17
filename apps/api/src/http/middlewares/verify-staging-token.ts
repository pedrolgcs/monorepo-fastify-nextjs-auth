import { env } from '@repo/env'
import { FastifyRequest } from 'fastify'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function verifyStagingToken(request: FastifyRequest) {
  try {
    const stagingApiToken = request.headers['x-staging-token']

    if (stagingApiToken !== env.STAGING_API_TOKEN) {
      throw new UnauthorizedError()
    }
  } catch (error) {
    throw new UnauthorizedError()
  }
}
