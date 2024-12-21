import fastifyCors from '@fastify/cors'
import fastifyJWT from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorhandler } from './error-handler'
import { routes } from './routes'

const app = fastify().withTypeProvider<ZodTypeProvider>()

// Zod
app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

// Cors
app.register(fastifyCors)

// Swagger
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Nextjs Fastify API',
      description: 'Authenticate using magic link template',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

// JWT
app.register(fastifyJWT, {
  secret: '0193ea55-540d-7449-af3c-172e9a8e39cf',
})

// Errors
app.setErrorHandler(errorhandler)

// routes
app.register(routes)

export { app }
