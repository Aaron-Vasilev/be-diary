import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { FastifyPluginAsyncTypebox, TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Static, Type } from '@sinclair/typebox'
import fastifyAuth from '@fastify/auth'

const Question = Type.Partial(Type.Object({ 
  id: Type.Number(),
  shown_date: Type.String(),
  text: Type.String(),
}))

type QuestionType = Static<typeof Question>
type QuestionShownDateReq = Pick<QuestionType, "shown_date">

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
        "SELECT * FROM diary.question WHERE shown_date=$1 LIMIT 1;", [request.body.shown_date],
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