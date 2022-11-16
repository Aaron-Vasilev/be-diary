import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { FastifyPluginAsyncTypebox, TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Static, Type } from '@sinclair/typebox'
import jwt from "jsonwebtoken"
import { decrypt, encrypt, Hash } from '../../utils/crypt'

const Login = Type.Object({
  email: Type.String(),
  password: Type.String(),
})

const LoginResponse = Type.Object({
  user_id: Type.Number(),
  name: Type.String(),
  token: Type.String(),
})

const UserRegister = Type.Partial(Type.Object({ 
  email: Type.String(),
  password: Type.String(),
  name: Type.String(),
}))

type LoginType = Static<typeof Login>
type LoginResponseType = Static<typeof LoginResponse>
type UserRegisterType = Static<typeof UserRegister>

const RegisterAuthRoute: FastifyPluginAsyncTypebox = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  const server = fastify.withTypeProvider<TypeBoxTypeProvider>()

  server.post<{ Body: LoginType , Reply: LoginResponseType  }>(
    '/login',
    {
      schema: {
        body: Login,
        response: {
          201: LoginResponse,
        },
      },
    },
    async (request, reply) => {
      const client = await server.pg.connect()
      try {
        const { email, password } = request.body
        const db_hash: Hash = { iv: '', password_hash: '' }
        const response: LoginResponseType = { user_id: 0, name: '', token: '' }

        const { rows } = await client.query(
          "SELECT * FROM private.user_account WHERE email=$1 LIMIT 1;", [email]
        )

        console.log('†', rows)
        db_hash.iv = rows[0].iv
        db_hash.password_hash = rows[0].password_hash
        response.user_id = rows[0].id
        response.name = rows[0].name

        if (decrypt(db_hash) === password) {
          const token = jwt.sign({
            user_id: response.user_id,
          }, process.env.JWT_SECRET)
          
          response.token = `Bearer ${token}`
        } else {
        }
        return reply.send(response)
      

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
        const { email, password, name } = request.body
        const { password_hash, iv } = encrypt(password)

        await client.query(
        `INSERT into private.user_account (email, password_hash, name, iv) VALUES
        	($1, $2, $3, $4);`, [email, password_hash, name, iv] 
        )

        return reply.send(0)
      } finally {
        client.release()
      }

        
    }
  )

}

export { 
  RegisterAuthRoute 
}