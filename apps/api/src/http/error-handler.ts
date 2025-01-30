import type { FastifyInstance } from 'fastify'
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'

import { AppError } from './_errors/app-error'
import { UnauthorizedError } from './_errors/unauthorized-error'

type FastifyErrorhandler = FastifyInstance['errorHandler']

export const errorhandler: FastifyErrorhandler = (error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'validation error.',
      details: {
        issues: error.validation.map((issue) => ({
          message: issue.message,
          path: issue.instancePath,
        })),
        method: request.method,
        url: request.url,
      },
    })
  }

  if (error instanceof AppError) {
    const errorData = error.toJSON()

    return reply.status(400).code(errorData.code).send({
      message: errorData.message,
    })
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({
      message: error.message,
    })
  }

  console.log(error)
  // send error to some observability platform

  return reply.status(500).send({
    message: 'internal server error.',
  })
}
