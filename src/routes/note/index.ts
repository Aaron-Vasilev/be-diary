import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { FastifyPluginAsyncTypebox, TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Static, Type } from '@sinclair/typebox'
import { STATUS_NOT_FOUND } from '../../utils/const'

const Note = Type.Partial(Type.Object({
  id: Type.Number(),
  userId: Type.Number(),
  questionId: Type.Number(),
  text: Type.String(),
  createdDate: Type.String(),
}))

type NoteType = Static<typeof Note>
type GetNotesBody = Pick<NoteType, "questionId" | "userId">
type PostNoteBody = Pick<NoteType, "text" | "createdDate" | "questionId" | "userId">

const RegisterNoteRoute: FastifyPluginAsyncTypebox = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  const server = fastify.withTypeProvider<TypeBoxTypeProvider>()

  server.post<{ Body: GetNotesBody, Reply: NoteType[] }>(
    '/get-notes',
    {
      schema: {
        body: Note ,
        response: {
          201: Note,
        },
      },
      onRequest: [
        // @ts-ignore
        server.jwtVerify
      ],
    },
    (request, reply) => {
      server.pg.query(
        `SELECT id AS "noteId", text, created_date AS "createdDate"  
          FROM diary.note WHERE question_id=$1 AND user_id=$2;`, [request.body.questionId, request.user],
        function onResult(err, result) {
          if (err) {
            console.log('get-notes', err)
            return reply.status(STATUS_NOT_FOUND).send([])
          }
          return reply.send(result.rows)
        }
      )
    }
  )

  server.post<{ Body: PostNoteBody, Reply: NoteType[] }>(
    '/add-note',
    {
      schema: {
        body: Note ,
        response: {
          201: Note,
        },
      },
      onRequest: [
        // @ts-ignore
        server.jwtVerify
      ],
    },
    (request, reply) => {
      server.pg.query(
        `INSERT into diary.note (user_id, text, created_date, question_id) VALUES
        	($1, $2, $3, $4) RETURNING id AS "noteId", text, question_id AS "questionId", 
          created_date AS "createdDate";`, 
          [+request.user, request.body.text, request.body.createdDate, request.body.questionId],
        function onResult(err, result) {
          if (err) {
            console.log('add-note', err)
            return reply.code(STATUS_NOT_FOUND).send([])
          }
          return reply.send(result.rows[0])
        }
      )
    }
  )


}

export { 
  RegisterNoteRoute 
}
