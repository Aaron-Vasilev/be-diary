import Fastify from 'fastify'
import postgres from "@fastify/postgres"
import cors from '@fastify/cors'
import { RegisterQuestionRoute} from './routes/question'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { RegisterNoteRoute } from './routes/note'
import { RegisterAuthRoute } from './routes/auth'
import { JWTValidation } from './controller/auth'

const server = Fastify({
  logger: Boolean(process.env.NODE_ENV === 'dev'),
}).withTypeProvider<TypeBoxTypeProvider>()

const port = +process.env.PORT || 8080
const host = process.env.NODE_ENV === 'dev' ? 'localhost' : '0.0.0.0'
server.register(postgres, {
  connectionString: process.env.DATABASE_URL
})
server.register(cors)
JWTValidation(server, {})
RegisterAuthRoute(server, {})
RegisterQuestionRoute(server, {})
RegisterNoteRoute(server, {})

server.listen({ port, host }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})

server.get('/', {}, (request, reply) => {
  reply
    .code(200)
    .type('text/html')
    .send("<h1>Sup</h1>")
})