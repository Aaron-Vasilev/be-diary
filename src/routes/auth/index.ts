import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { FastifyPluginAsyncTypebox, TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Static, Type } from '@sinclair/typebox'
import jwt from "jsonwebtoken"
import { decrypt, encrypt, Hash } from '../../utils/crypt'
import { STATUS_ANAUTHORIZED, STATUS_NOT_ACCETABLE, STATUS_NOT_FOUND } from '../../utils/const'

const Login = Type.Object({
  email: Type.String(),
  password: Type.String(),
})

const LoginResponse = Type.Object({
  token: Type.String(),
})

const UserRegister = Type.Partial(Type.Object({ 
  email: Type.String(),
  password: Type.String(),
  firstName: Type.String(), 
  secondName: Type.String(),
}))

type LoginType = Static<typeof Login>
type LoginResponseType = Static<typeof LoginResponse> | Number
type UserRegisterType = Static<typeof UserRegister>

const RegisterAuthRoute: FastifyPluginAsyncTypebox = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  const server = fastify.withTypeProvider<TypeBoxTypeProvider>()

  server.post<{ Body: LoginType , Reply: LoginResponseType | Number }>(
    '/login',
    {
      schema: {
        body: Login,
        response: {
          201: LoginResponse,
          401: Type.Number()
        },
      },
    },
    async (request, reply) => {
      const client = await server.pg.connect()
      try {
        const { email, password } = request.body
        const db_hash: Hash = { iv: '', passwordHash: '' }
        const response: LoginResponseType = { token: '' }

        const { rows } = await client.query(
          "SELECT * FROM private.user_account WHERE email=$1 LIMIT 1;", [email]
        )

        if (rows.length === 0) {
          return reply.code(STATUS_NOT_FOUND).send(1)
        }

        db_hash.iv = rows[0].iv
        db_hash.passwordHash = rows[0].password_hash

        if (decrypt(db_hash) !== password) {
          return reply.code(STATUS_ANAUTHORIZED).send(1)
        } 

        const userQuery = await client.query(
          `SELECT id, first_name AS "firstName", second_name AS "secondName"
            FROM  diary.user WHERE id=$1 LIMIT 1;`, [rows[0].id]
        )
        
        const token = jwt.sign({
          userId: userQuery.rows[0].id,
          role: rows[0].role,
          firstName: userQuery.rows[0].firstName,
          secondName: userQuery.rows[0].secondName,
        }, process.env.JWT_SECRET)
        
        response.token = `Bearer ${token}`

        return reply.send(response)
      } catch (e) {
        console.log('???', e)
        reply.status(STATUS_ANAUTHORIZED).send(1)
      } finally {
        client.release()
      }
    }
  )

  server.post<{ Body: UserRegisterType, Reply: number }>(
    '/register',
    {
      schema: {
        body: UserRegister,
        response: {
          201: Type.Number(),
        },
      },
    },
    async (request, reply) => {
      const client = await server.pg.connect()
      try {
        const { email, password, firstName, secondName } = request.body
        const { passwordHash, iv } = encrypt(password)

        const { rows } = await client.query(
        `INSERT into diary.user (first_name, second_name) VALUES
        	($1, $2) RETURNING id;`, [firstName, secondName] 
        )

        await client.query(
        `INSERT into private.user_account (id, email, password_hash, iv) VALUES
        	($1, $2, $3, $4);`, [rows[0].id, email, passwordHash, iv] 
        )

        return reply.send(0)
      } catch (e) {
        reply.code(STATUS_NOT_ACCETABLE).send(1)
      } finally {
        client.release()
      }
    }
  )
}

export { 
  RegisterAuthRoute 
}
