import { FastifyTypedInstance } from '@/types/fastify'

import { authenticateWithOpt } from './auth/authenticate-with-opt'
import { refreshToken } from './auth/refresh-token'
import { verifyOPTCode } from './auth/verify-opt-code'
import { healthCheck } from './health-check'
import { getUserProfile } from './user/get-user-profile'
import { updateUserProfile } from './user/update-user-profile'

export async function routes(app: FastifyTypedInstance) {
  // app
  healthCheck(app)

  // auth
  authenticateWithOpt(app)
  verifyOPTCode(app)
  refreshToken(app)

  // user
  getUserProfile(app)
  updateUserProfile(app)
}
