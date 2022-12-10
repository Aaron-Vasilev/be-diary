import pg from "pg"
import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { FastifyPluginAsyncTypebox, TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Static, Type } from '@sinclair/typebox'

const Question = Type.Partial(Type.Object({ 
  id: Type.Number(),
  shownDate: Type.String(),
  text: Type.String(),
}))

type QuestionType = Static<typeof Question>
type QuestionShownDateReq = Pick<QuestionType, "shownDate">

pg.types.setTypeParser(1082, (val) => val)

const RegisterQuestionRoute: FastifyPluginAsyncTypebox = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  const server = fastify.withTypeProvider<TypeBoxTypeProvider>()
  
  server.post<{ Body: QuestionShownDateReq , Reply: QuestionType }>(
    '/get-question',
    {
      schema: {
        body: Question,
        response: {
          201: Question,
        },
      },
      onRequest: [
        // @ts-ignore
        server.jwtVerify
      ],
    },
    (request, reply) => {
      const [year, month, day] = request.body.shownDate.split('-')

      server.pg.query(
        `SELECT id, text, shown_date AS "shownDate" FROM diary.question 
          WHERE extract(month from shown_date)=$1 AND extract(day from shown_date)=$2 LIMIT 1;`, [month, day], 
        function onResult(err, result) {
          if (err)
            return console.log('†',err)
          else {
            return reply.send(result.rows[0])
          }
        }
      )
    }
  )
}

export { 
  RegisterQuestionRoute 
}