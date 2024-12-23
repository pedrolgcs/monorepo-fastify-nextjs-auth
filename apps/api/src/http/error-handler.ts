import type { FastifyInstance } from 'fastify'
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'

import { BadRequestError } from './_errors/bad-request-error'
import { MaxRetriesWhenGenerateOPTCodeError } from './_errors/max-retries-when-generate-opt-code'
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

  if (error instanceof BadRequestError) {
    return reply.status(400).send({
      message: error.message,
    })
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({
      message: error.message,
    })
  }

  if (error instanceof MaxRetriesWhenGenerateOPTCodeError) {
    return reply.status(422).send({
      message: error.message,
    })
  }

  console.log(error)
  // send error to some observability platform

  return reply.status(500).send({
    message: 'internal server error.',
  })
}
