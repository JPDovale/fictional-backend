import { Service } from '@shared/core/contracts/Service'
import { Either, left, right } from '@shared/core/errors/Either'
import { Injectable } from '@nestjs/common'
import { User } from '../entities/User'
import { UsersRepository } from '../repositories/Users.repository'
import { UserAlreadyExistsWithSameEmail } from '../errors/UserAlreadyExists.error'
import { UserNotFound } from '../errors/UserNotFound.error'
import { UserEmailCantBeUpdaterWithAuthId } from '../errors/UserEmailCantBeUpdatedWithAuthId.error'

type Request = {
  userId: string
  name?: string
  email?: string
  imageUrl?: string | null
}

type PossibleErrors =
  | UserAlreadyExistsWithSameEmail
  | UserNotFound
  | UserEmailCantBeUpdaterWithAuthId

type Response = {
  user: User
}

@Injectable()
export class UpdateUserService
  implements Service<Request, PossibleErrors, Response>
{
  constructor(private readonly userRepository: UsersRepository) {}

  async execute({
    name,
    email,
    userId,
    imageUrl,
  }: Request): Promise<Either<PossibleErrors, Response>> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      return left(new UserNotFound())
    }

    if (email) {
      const userWithSameEmail = await this.userRepository.findByEmail(email)

      if (userWithSameEmail && !user.equals(userWithSameEmail)) {
        return left(new UserAlreadyExistsWithSameEmail())
      }
    }

    if (user.authId && email !== user.email) {
      return left(new UserEmailCantBeUpdaterWithAuthId())
    }

    user.name = name
    user.email = email
    user.imageUrl = imageUrl
    user.username = name

    await this.userRepository.save(user)

    return right({ user })
  }
}
