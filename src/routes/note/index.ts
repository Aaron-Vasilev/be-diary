import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { FastifyPluginAsyncTypebox, TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Static, Type } from '@sinclair/typebox'

const Note = Type.Partial(Type.Object({
  id: Type.Number(),
  text: Type.String(),
  createdAt: Type.String(),
  questionId: Type.Number()
}))

type NoteType = Static<typeof Note>
type GetNotesBody = Pick<NoteType, "questionId">
type PostNoteBody = Pick<NoteType, "text" | "createdAt" | "questionId">

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
        "SELECT * FROM diary.note WHERE question_id=$1;", [request.body.questionId],
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
        `INSERT into diary.note (text, created_date, questionId) VALUES
        	($1, $2, $3) RETURNING *;`, 
          [request.body.text, request.body.createdAt, request.body.questionId],
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