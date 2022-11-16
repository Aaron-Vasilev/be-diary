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
type GetNotesBody = Pick<NoteType, "question_id">
type PostNoteBody = Pick<NoteType, "text" | "created_at" | "question_id">

const RegisterNoteRoute: FastifyPluginAsyncTypebox = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  const server = fastify.withTypeProvider<TypeBoxTypeProvider>()

  server.post<{ Body: GetNotesBody, Reply: NoteType[] }>(
    '/getnotes',
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

  server.post<{ Body: PostNoteBody, Reply: NoteType[] }>(
    '/postnote',
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
        `INSERT into diary.note (text, created_date, question_id) VALUES
        	($1, $2, $3) RETURNING *;`, 
          [request.body.text, request.body.created_at, request.body.question_id],
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