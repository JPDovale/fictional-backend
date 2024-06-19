import { Service } from '@shared/core/contracts/Service'
import { Either, left, right } from '@shared/core/errors/Either'
import { Injectable } from '@nestjs/common'
import { User } from '../entities/User'
import { UserNotFound } from '../errors/UserNotFound.error'
import { UsersRepository } from '../repositories/Users.repository'

type PossibleErrors = UserNotFound

type Response = {
  user: User
}

@Injectable()
export class GetFirstUserService
  implements Service<null, PossibleErrors, Response>
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(): Promise<Either<UserNotFound, Response>> {
    const user = await this.usersRepository.findFirst()

    if (!user) {
      return left(new UserNotFound())
    }

    return right({ user })
  }
}
