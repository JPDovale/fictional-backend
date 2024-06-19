import { hash, compare } from 'bcryptjs'
import { HashGenerator } from '../contracts/HashGenerator'
import { HashComparer } from '../contracts/HashComparer'

export class BcryptHasher implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    const hashSalt = 10

    const hashCreated = await hash(plain, hashSalt)

    return hashCreated
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return await compare(plain, hash)
  }
}
