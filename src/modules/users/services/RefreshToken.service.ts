import { Service } from '@shared/core/contracts/Service'
import { Either, left, right } from '@shared/core/errors/Either'
import { Injectable } from '@nestjs/common'
import { CannotGetSafeLocationForImage } from '@providers/base/images/errors/CannotGetSafeLocationForImage.error'
import { UsersRepository } from '../repositories/Users.repository'
import { UserAlreadyExistsWithSameEmail } from '../errors/UserAlreadyExists.error'
import { UserInvalidCredentials } from '../errors/UserInvalidCredentials.error'
import { Encrypter } from '@providers/cryptography/contracts/Encrypter'
import { EnvService } from '@infra/env/Env.service'
import { DateAddition } from '@providers/date/contracts/DateAddition'
import { RefreshTokensRepository } from '../repositories/RefreshTokens.repository'
import { RefreshToken } from '../entities/RefreshToken'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'
import { Decoder } from '@providers/cryptography/contracts/Decoder'
import { SessionExpired } from '../errors/SessionExpired.error'
import { UserNotFound } from '../errors/UserNotFound.error'
import { DateVerifications } from '@providers/date/contracts/DateVerifications'

type Request = {
  token: string
}

type PossibleErrors =
  | UserAlreadyExistsWithSameEmail
  | CannotGetSafeLocationForImage

type Response = {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class RefreshTokenService
  implements Service<Request, PossibleErrors, Response>
{
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly dateVerifications: DateVerifications,
    private readonly encrypter: Encrypter,
    private readonly decoder: Decoder,
    private readonly env: EnvService,
    private readonly dateAddition: DateAddition,
    private readonly refreshTokenRepository: RefreshTokensRepository,
  ) {}

  async execute({ token }: Request): Promise<Either<PossibleErrors, Response>> {
    let decodedToken: TokenPayloadSchema

    try {
      const decodedTokenRaw = await this.decoder.decrypt(token)

      if (!decodedTokenRaw.payload || !decodedTokenRaw.isValid) {
        return left(new SessionExpired())
      }

      decodedToken = decodedTokenRaw.payload
    } catch (err) {
      return left(new SessionExpired())
    }

    if (!decodedToken.sub) {
      return left(new UserInvalidCredentials())
    }

    const user = await this.userRepository.findById(decodedToken.sub)
    if (!user) {
      return left(new UserNotFound())
    }

    const oldRefreshToken =
      await this.refreshTokenRepository.findByUserIdAndToken(
        user.id.toString(),
        token,
      )
    if (!oldRefreshToken) {
      return left(new SessionExpired())
    }

    const tokenIsValid = this.dateVerifications.isBefore({
      startDate: new Date(),
      endDate: oldRefreshToken.expiresIn,
    })
    await this.refreshTokenRepository.delete(oldRefreshToken.id.toString())

    if (!tokenIsValid || token !== oldRefreshToken.token) {
      return left(new SessionExpired())
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
