import { User } from '@modules/users/entities/User'
import { Prisma, User as UserFile } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { RepositoryMapper } from '@shared/core/contracts/Repository'
import { Username } from '@modules/users/valueObjects/Username'
import { UniqueId } from '@shared/core/valueObjects/UniqueId'

@Injectable()
export class UsersPrismaMapper extends RepositoryMapper<
  User,
  UserFile,
  Prisma.UserUncheckedCreateInput
> {
  toDomain(raw: UserFile): User {
    return User.create(
      {
        name: raw.name,
        username: Username.create(raw.username),
        password: raw.password,
        email: raw.email,
        imageUrl: raw.imageUrl,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt,
        verified: raw.verified,
        authId: raw.authId,
      },
      UniqueId.create(raw.id),
    )
  }

  toPersistence(entity: User): Prisma.UserUncheckedCreateInput {
    return {
      id: entity.id.toString(),
      createdAt: entity.createdAt,
      deletedAt: entity.deletedAt,
      email: entity.email,
      imageUrl: entity.imageUrl,
      name: entity.name,
      password: entity.password,
      updatedAt: entity.updatedAt,
      authId: entity.authId,
      verified: entity.verified,
      username: entity.username.toString(),
    }
  }
}
