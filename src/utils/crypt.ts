import crypto from "crypto"
import dotenv from "dotenv"

export interface Hash {
  iv: string
  password_hash: string
}

dotenv.config()
const algorithm = 'aes-256-ctr'

export function encrypt(text: string): Hash {
  const iv = crypto.randomBytes(16)

  const cipher = crypto.createCipheriv(algorithm, process.env.PASSWORD_KEY, iv)

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()])

  return {
    iv: iv.toString('hex'),
    password_hash: encrypted.toString('hex')
  }
}

export function decrypt(hash: Hash): string {
  const decipher = crypto.createDecipheriv(algorithm, process.env.PASSWORD_KEY, Buffer.from(hash.iv, 'hex'))

  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.password_hash, 'hex')), decipher.final()])

  return decrpyted.toString()
}