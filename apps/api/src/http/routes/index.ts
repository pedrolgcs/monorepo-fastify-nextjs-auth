import { FastifyTypedInstance } from '@/types/fastify'

import { authenticateWithPassword } from './auth/authenticate-with-password'
import { healthCheck } from './health-check'

export async function routes(app: FastifyTypedInstance) {
  // app
  healthCheck(app)

  // auth
  authenticateWithPassword(app)
}
