import { UserNotFound } from '@modules/users/errors/UserNotFound.error'
import { Service } from '@shared/core/contracts/Service'
import { Either, left, right } from '@shared/core/errors/Either'
import { Injectable } from '@nestjs/common'
import { UsersRepository } from '@modules/users/repositories/Users.repository'
import { StorageRepository } from '@infra/storage/contracts/Storage.repository'
import { CannotGetUploadUrl } from '../errors/CannotGetUploadUrl.error'

type Request = {
  userId: string
  filename: string
  contentType: string
}

type PossibleErrors = UserNotFound | CannotGetUploadUrl

type Response = {
  uploadUrl: string
  name: string
}

@Injectable()
export class GetUploadUrlService
  implements Service<Request, PossibleErrors, Response>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly storageRepository: StorageRepository,
  ) {}

  async execute({
    userId,
    filename,
    contentType,
  }: Request): Promise<Either<PossibleErrors, Response>> {
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      return left(new UserNotFound())
    }

    const uploadObj = await this.storageRepository.getSignedUrl({
      filename,
      contentType,
    })
    if (!uploadObj) {
      return left(new CannotGetUploadUrl())
    }

    const { uploadUrl, name } = uploadObj

    return right({ uploadUrl, name })
  }
}
