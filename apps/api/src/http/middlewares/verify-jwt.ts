import { FastifyRequest } from 'fastify'

import { UnauthorizedError } from '../_errors/unauthorized-error'

async function verifyJWT(request: FastifyRequest) {
  try {
    await request.jwtVerify()
  } catch (error) {
    throw new UnauthorizedError()
  }
}

export { verifyJWT }