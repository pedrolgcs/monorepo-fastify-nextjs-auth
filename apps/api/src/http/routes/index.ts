import { FastifyTypedInstance } from '@/types/fastify'

import { healthCheck } from './health-check'

export async function routes(app: FastifyTypedInstance) {
  healthCheck(app)
}
