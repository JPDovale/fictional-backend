import { Injectable } from '@nestjs/common'
import { UserWrongCredentials } from '../errors/UserWrongCredentials.error'
import { HashComparer } from '@providers/cryptography/contracts/HashComparer'
import { Encrypter } from '@providers/cryptography/contracts/Encrypter'
import { EnvService } from '@infra/env/Env.service'
import { DateAddition } from '@providers/date/contracts/DateAddition'
import { Either, left, right } from '@shared/core/errors/Either'
import { UsersRepository } from '../repositories/Users.repository'
import { RefreshTokensRepository } from '../repositories/RefreshTokens.repository'
import { RefreshToken } from '../entities/RefreshToken'

interface Request {
  email: string
  password: string
}

type Response = Either<
  UserWrongCredentials,
  {
    accessToken: string
    refreshToken: string
  }
>

@Injectable()
export class LoginUserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly env: EnvService,
    private readonly dateAddition: DateAddition,
    private readonly refreshTokenRepository: RefreshTokensRepository,
  ) {}

  async execute({ email, password }: Request): Promise<Response> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      return left(new UserWrongCredentials())
    }

    if (!user.password) {
      return left(new UserWrongCredentials())
    }

    const passwordMatch = await this.hashComparer.compare(
      password,
      user.password,
    )

    if (!passwordMatch) {
      return left(new UserWrongCredentials())
    }

    const accessToken = await this.encrypter.encrypt(
      {
        sub: user.id.toString(),
      },
      {
        expiresIn: this.env.get('JWT_USER_ACCESS_EXPIRES_IN'),
      },
    )

    const _refreshToken = await this.encrypter.encrypt(
      {
        sub: user.id.toString(),
      },
      {
        expiresIn: this.env.get('JWT_USER_REFRESH_EXPIRES_IN'),
      },
    )

    const refreshToken = RefreshToken.create({
      userId: user.id,
      token: _refreshToken,
      expiresIn: this.dateAddition.addDaysInCurrentDate(
        this.env.get('USER_REFRESH_EXPIRES_IN'),
      ),
    })

    await this.refreshTokenRepository.create(refreshToken)

    return right({
      accessToken,
      refreshToken: refreshToken.token,
    })
  }
}
