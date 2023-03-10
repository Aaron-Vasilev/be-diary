import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify'
import jwt from "@fastify/jwt"
import { STATUS_ANAUTHORIZED } from '../../utils/const'

interface Token {
  userId: number
  firstName: string
  secondName: string
  iat: number
}

export function JWTValidation(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET
  })

  fastify.decorate('jwtVerify', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId }  = await request.jwtVerify<Token>()
      request.user = userId.toString()
    } catch (e) {
      console.log('† In JWTValidation', e)
      reply.status(STATUS_ANAUTHORIZED).send('Invalid Token')
    }
  })
}