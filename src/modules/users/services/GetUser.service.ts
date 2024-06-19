import { Service } from '@shared/core/contracts/Service'
import { Either, left, right } from '@shared/core/errors/Either'
import { Injectable } from '@nestjs/common'
import { User } from '../entities/User'
import { UserNotFound } from '../errors/UserNotFound.error'
import { UsersRepository } from '../repositories/Users.repository'

type Request = {
  id: string
}

type PossibleErrors = UserNotFound

type Response = {
  user: User
}

@Injectable()
export class GetUserService
  implements Service<Request, PossibleErrors, Response>
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({ id }: Request): Promise<Either<UserNotFound, Response>> {
    const user = await this.usersRepository.findById(id)

    if (!user) {
      return left(new UserNotFound())
    }

    return right({ user })
  }
}
