import Fastify from 'fastify'
import postgres from "@fastify/postgres"
import { RegisterQuestionRoute} from './routes/question'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { RegisterNoteRoute } from './routes/note'

const server = Fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>()
const port = 8080

server.register(postgres, {
  connectionString: 'postgres://postgres@localhost:5432/db_diary'
})

RegisterQuestionRoute(server, {})
RegisterNoteRoute(server, {})

server.listen({ port }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})