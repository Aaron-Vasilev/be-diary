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
    '/question',
    {
      schema: {
        body: Question,
        response: {
          201: Question,
        },
      },
      onRequest: [
        //@ts-ignore
        server.jwtVerify
      ],
    },
    (request, reply) => {
      server.pg.query(
        "SELECT * FROM diary.question WHERE shown_date=$1 LIMIT 1;", [request.body.shownDate],
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