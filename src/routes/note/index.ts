import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { FastifyPluginAsyncTypebox, TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Static, Type } from '@sinclair/typebox'

const Note = Type.Partial(Type.Object({
  id: Type.Number(),
  text: Type.String(),
  created_at: Type.String(),
  question_id: Type.Number()
}))

type NoteType = Static<typeof Note>
type NoteCreatedAtReq = Pick<NoteType, "question_id">

const RegisterNoteRoute: FastifyPluginAsyncTypebox = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  const server = fastify.withTypeProvider<TypeBoxTypeProvider>()

  server.post<{ Body: NoteCreatedAtReq, Reply: NoteType[] }>(
    '/note',
    {
      schema: {
        body: Note ,
        response: {
          201: Note,
        },
      },
    },
    (request, reply) => {
      server.pg.query(
        "SELECT * FROM diary.note WHERE question_id=$1;", [request.body.question_id],
        function onResult(err, result) {
          if (err)
            console.log(err)
          return reply.send(result.rows)
        }
      )
    }
  )


}

export { 
  RegisterNoteRoute 
}
//npm uninstall type-graphql sequelize reflect-metadata postgraphile pg-hstore graphql 
//    class-validator @graphile-contrib/pg-simplify-inflector --force