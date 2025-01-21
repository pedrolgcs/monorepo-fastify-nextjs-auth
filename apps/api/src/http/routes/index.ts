import { env } from '@repo/env'

import { FastifyTypedInstance } from '@/types/fastify'

import { sandBoxRoutes } from './__sandbox'
import { authenticateWithEmail } from './auth/authenticate-with-email'
import { getTokensByUser } from './auth/get-tokens-by-user'
import { logout } from './auth/logout'
import { refreshToken } from './auth/refresh-token'
import { revokeRefreshToken } from './auth/revoke-refresh-token'
import { verifyOPTCode } from './auth/verify-opt-code'
import { healthCheck } from './health-check'
import { getUserProfile } from './user/get-user-profile'
import { updateUserProfile } from './user/update-user-profile'

export async function routes(app: FastifyTypedInstance) {
  healthCheck(app)

  authenticateWithEmail(app)
  verifyOPTCode(app)
  refreshToken(app)
  getTokensByUser(app)
  revokeRefreshToken(app)
  logout(app)

  getUserProfile(app)
  updateUserProfile(app)

  if (env.ENV_TYPE === 'staging') {
    sandBoxRoutes(app)
  }
}
