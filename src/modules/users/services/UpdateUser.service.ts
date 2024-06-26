import { Service } from '@shared/core/contracts/Service'
import { Either, left, right } from '@shared/core/errors/Either'
import { Injectable } from '@nestjs/common'
import { ImagesManipulatorProvider } from '@providers/base/images/contracts/ImagesManipulator.provider'
import { CannotGetSafeLocationForImage } from '@providers/base/images/errors/CannotGetSafeLocationForImage.error'
import { User } from '../entities/User'
import { UsersRepository } from '../repositories/Users.repository'
import { UserAlreadyExistsWithSameEmail } from '../errors/UserAlreadyExists.error'
import { UserNotFound } from '../errors/UserNotFound.error'

type Request = {
  userId: string
  name?: string
  email?: string
  photoUrl?: string | null
  verified?: boolean
  authId?: string | null
}

type PossibleErrors =
  | UserAlreadyExistsWithSameEmail
  | UserNotFound
  | CannotGetSafeLocationForImage

type Response = {
  user: User
}

@Injectable()
export class UpdateUserService
  implements Service<Request, PossibleErrors, Response>
{
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly ImagesManipulatorProvider: ImagesManipulatorProvider,
  ) {}

  async execute({
    name,
    email,
    userId,
    authId,
    photoUrl,
    verified,
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

    const imageSecure = await this.ImagesManipulatorProvider.getImage(
      photoUrl ?? '',
    )

    if (photoUrl && !imageSecure) {
      return left(new CannotGetSafeLocationForImage())
    }

    if (photoUrl && imageSecure) {
      await imageSecure.copyToSecure()
    }

    user.authId = authId
    user.name = name
    user.email = email
    user.imageUrl = imageSecure?.savedName
    user.verified = verified
    user.username = name

    await this.userRepository.save(user)

    return right({ user })
  }
}
