import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { FastifyPluginAsyncTypebox, TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Static, Type } from '@sinclair/typebox'

const Question = Type.Partial(Type.Object({ 
  shown_date: Type.String(),
  text: Type.String(),
  id: Type.Number(),
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
    },
    (request, reply) => {
      server.pg.query(
        "SELECT * FROM diary.question WHERE shown_date=$1 LIMIT 1;", [request.body.shown_date],
        function onResult(err, result) {
          if (err)
            console.log(err)
          return reply.send(result.rows[0])
        }
      )
    }
  )


}

export { 
  RegisterQuestionRoute 
}