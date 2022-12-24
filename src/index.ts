import Fastify from 'fastify'
import postgres from "@fastify/postgres"
import cors from '@fastify/cors'
import { RegisterQuestionRoute} from './routes/question'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { RegisterNoteRoute } from './routes/note'
import { RegisterAuthRoute } from './routes/auth'
import { JWTValidation } from './controller/auth'

const ENV = process.env.NODE_ENV
const PORT = +process.env.PORT || 8080
const HOST = process.env.HOST
const DATABASE_URL = process.env.DATABASE_URL

const server = Fastify({
  logger: Boolean(ENV === 'dev'),
}).withTypeProvider<TypeBoxTypeProvider>()

server.register(postgres, {
  connectionString: DATABASE_URL,
})
server.register(cors)
JWTValidation(server, {})
RegisterAuthRoute(server, {})
RegisterQuestionRoute(server, {})
RegisterNoteRoute(server, {})

server.listen({ port: PORT, host: HOST }, (err, address) => {
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
