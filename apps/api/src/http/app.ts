import fastifyCookie from '@fastify/cookie'
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
app.register(fastifyCors, {
  origin: 'http://localhost:3000',
  credentials: true,
})

// JWT
app.register(fastifyJWT, {
  secret: '0193ea55-540d-7449-af3c-172e9a8e39cf',
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

// Cookies
app.register(fastifyCookie)

// Swagger
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'OPT Authenticate API',
      description: 'Authenticate using OPT',
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

// Errors
app.setErrorHandler(errorhandler)

// routes
app.register(routes)

export { app }
