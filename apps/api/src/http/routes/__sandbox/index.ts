import type { FastifyTypedInstance } from '@/types/fastify'

import { clearAccessByUser } from './clear-access-by-user'
import { generateOptCode } from './generate-opt-code'
import { signIn } from './sign-in'

export async function sandBoxRoutes(app: FastifyTypedInstance) {
  signIn(app)
  generateOptCode(app)
  clearAccessByUser(app)
}
