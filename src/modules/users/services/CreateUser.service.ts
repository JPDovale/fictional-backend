import { Service } from '@shared/core/contracts/Service'
import { Either, left, right } from '@shared/core/errors/Either'
import { Injectable } from '@nestjs/common'
import { CannotGetSafeLocationForImage } from '@providers/base/images/errors/CannotGetSafeLocationForImage.error'
import { User } from '../entities/User'
import { UsersRepository } from '../repositories/Users.repository'
import { UserAlreadyExistsWithSameEmail } from '../errors/UserAlreadyExists.error'
import { HashGenerator } from '@providers/cryptography/contracts/HashGenerator'

type Request = {
  name: string
  email: string
  password: string
  photoUrl?: string | null
}

type PossibleErrors =
  | UserAlreadyExistsWithSameEmail
  | CannotGetSafeLocationForImage

type Response = {
  user: User
}

@Injectable()
export class CreateUserService
  implements Service<Request, PossibleErrors, Response>
{
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: Request): Promise<Either<PossibleErrors, Response>> {
    const _user = await this.userRepository.findByEmail(email)
    if (_user) {
      return left(new UserAlreadyExistsWithSameEmail())
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const user = User.create({
      name,
      email,
      password: hashedPassword,
    })

    await this.userRepository.create(user)

    return right({ user })
  }
}
