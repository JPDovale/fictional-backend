import { Service } from '@shared/core/contracts/Service'
import { Either, left, right } from '@shared/core/errors/Either'
import { Injectable } from '@nestjs/common'
import { CannotGetSafeLocationForImage } from '@providers/base/images/errors/CannotGetSafeLocationForImage.error'
import { User } from '../entities/User'
import { UsersRepository } from '../repositories/Users.repository'
import { UserAlreadyExistsWithSameEmail } from '../errors/UserAlreadyExists.error'
import { FirebaseService } from '@infra/database/firebase/Firebase.service'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { UserInvalidCredentials } from '../errors/UserInvalidCredentials.error'
import { Encrypter } from '@providers/cryptography/contracts/Encrypter'
import { EnvService } from '@infra/env/Env.service'
import { DateAddition } from '@providers/date/contracts/DateAddition'
import { RefreshTokensRepository } from '../repositories/RefreshTokens.repository'
import { RefreshToken } from '../entities/RefreshToken'
import { TransactorService } from '@infra/database/transactor/contracts/Transactor.service'

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
export class SocialLoginUserService
  implements Service<Request, PossibleErrors, Response>
{
  constructor(
    private readonly transactor: TransactorService,
    private readonly userRepository: UsersRepository,
    private readonly firebaseService: FirebaseService,
    private readonly encrypter: Encrypter,
    private readonly env: EnvService,
    private readonly dateAddition: DateAddition,
    private readonly refreshTokenRepository: RefreshTokensRepository,
  ) {}

  async execute({ token }: Request): Promise<Either<PossibleErrors, Response>> {
    let decodedToken: DecodedIdToken

    try {
      decodedToken = await this.firebaseService.firebase
        .auth()
        .verifyIdToken(token)
    } catch (err) {
      return left(new UserInvalidCredentials())
    }

    if (!decodedToken.email) {
      return left(new UserInvalidCredentials())
    }

    let user: User | null = null
    const transaction = this.transactor.start()

    user = await this.userRepository.findByEmail(decodedToken.email)

    if (!user) {
      user = User.create({
        name: decodedToken.name,
        email: decodedToken.email,
        authId: decodedToken.uid,
        verified: decodedToken.emailVerified,
        imageUrl: decodedToken.picture,
      })

      transaction.add((ctx) => this.userRepository.create(user!, ctx))
    }

    if (user.email !== decodedToken.email) {
      return left(new UserInvalidCredentials())
    }

    if (user.authId !== decodedToken.uid) {
      return left(new UserInvalidCredentials())
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

    transaction.add((ctx) =>
      this.refreshTokenRepository.create(refreshToken, ctx),
    )

    await this.transactor.execute(transaction)

    return right({
      accessToken,
      refreshToken: refreshToken.token,
    })
  }
}
