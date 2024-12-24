import { FastifyTypedInstance } from '@/types/fastify'

import { authenticateWithPassword } from './auth/authenticate-with-password'
import { refreshToken } from './auth/refresh-token'
import { verifyOPTCode } from './auth/verify-opt-code'
import { healthCheck } from './health-check'
import { organization } from './organizations'

export async function routes(app: FastifyTypedInstance) {
  // app
  healthCheck(app)

  // auth
  authenticateWithPassword(app)
  verifyOPTCode(app)
  refreshToken(app)

  // organization
  organization(app)
}
