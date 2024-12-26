import { FastifyTypedInstance } from '@/types/fastify'

import { authenticateWithEmail } from './auth/authenticate-with-email'
import { getTokensByUser } from './auth/get-tokens-by-user'
import { logout } from './auth/logout'
import { refreshToken } from './auth/refresh-token'
import { verifyOPTCode } from './auth/verify-opt-code'
import { healthCheck } from './health-check'
import { getUserProfile } from './user/get-user-profile'
import { updateUserProfile } from './user/update-user-profile'

export async function routes(app: FastifyTypedInstance) {
  // app
  healthCheck(app)

  // auth
  authenticateWithEmail(app)
  verifyOPTCode(app)
  refreshToken(app)
  getTokensByUser(app)
  logout(app)

  // user
  getUserProfile(app)
  updateUserProfile(app)
}
