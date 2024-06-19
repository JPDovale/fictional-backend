import { User } from '@modules/users/entities/User'
import { User as UserFile } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { RepositoryMapper } from '@shared/core/contracts/Repository'
import { Username } from '@modules/users/valueObjects/Username'
import { UniqueId } from '@shared/core/valueObjects/UniqueId'

@Injectable()
export class UsersPrismaMapper extends RepositoryMapper<User, UserFile> {
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
        // verified: raw.verified,
        // skipLogin: raw.skip_login,
        // authId: raw.auth_id,
        // accessToken: raw.access_token,
      },
      UniqueId.create(raw.id),
    )
  }

  toPersistence(entity: User): UserFile {
    return {
      id: entity.id.toString(),
      createdAt: entity.createdAt,
      deletedAt: entity.deletedAt,
      email: entity.email,
      imageUrl: entity.imageUrl,
      name: entity.name,
      password: entity.password,
      updatedAt: entity.updatedAt,
      username: entity.username.toString(),
      // auth_id: entity.authId,
      // access_token: entity.accessToken,
      // verified: entity.verified,
      // skip_login: entity.skipLogin,
    }
  }
}
