import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@shared/core/errors/Either'
import { UsersRepository } from '../repositories/Users.repository'
import { RefreshTokensRepository } from '../repositories/RefreshTokens.repository'
import { UserNotFound } from '../errors/UserNotFound.error'

interface Request {
  userId: string
}

type Response = Either<UserNotFound, null>

@Injectable()
export class DeleteUserSessionsService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly refreshTokenRepository: RefreshTokensRepository,
  ) {}

  async execute({ userId }: Request): Promise<Response> {
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      return left(new UserNotFound())
    }

    await this.refreshTokenRepository.deleteAllByUserId(userId)

    return right(null)
  }
}
