import Fastify from 'fastify'
import postgres from "@fastify/postgres"
import auth from "@fastify/auth"
import jwt from "@fastify/jwt"
import { RegisterQuestionRoute} from './routes/question'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { RegisterNoteRoute } from './routes/note'
import { RegisterAuthRoute } from './routes/auth'

const server = Fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>()
const port = 8080

server.register(postgres, {
  connectionString: 'postgres://postgres@localhost:5432/db_diary'
})

server.register(auth)

RegisterAuthRoute(server, {})
RegisterQuestionRoute(server, {})
RegisterNoteRoute(server, {})

server.listen({ port }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})