import fastify, { FastifyReply, FastifyRequest } from "fastify";

async function getQuestionByDate(req: FastifyRequest, reply: FastifyReply) {
  const { date } = req.query
  fastify().pg.query(
    "SELECT * FROM diary.question WHERE shown_date=[$date] LIMIT 1;", date
  )
}