import { RefreshToken } from '@modules/users/entities/RefreshToken'
import { Injectable } from '@nestjs/common'
import { RefreshToken as RefreshTokenFile } from '@prisma/client'
import { RepositoryMapper } from '@shared/core/contracts/Repository'
import { UniqueId } from '@shared/core/valueObjects/UniqueId'

@Injectable()
export class RefreshTokensPrismaMapper extends RepositoryMapper<
  RefreshToken,
  RefreshTokenFile
> {
  toDomain(raw: RefreshTokenFile): RefreshToken {
    return RefreshToken.create(
      {
        expiresIn: raw.expiresIn,
        token: raw.token,
        userId: UniqueId.create(raw.userId),
        createdAt: raw.createdAt,
        expiredAt: raw.expiredAt,
      },
      UniqueId.create(raw.id),
    )
  }

  toPersistence(entity: RefreshToken): RefreshTokenFile {
    return {
      expiresIn: entity.expiresIn,
      createdAt: entity.createdAt,
      expiredAt: entity.expiredAt,
      id: entity.id.toString(),
      token: entity.token,
      userId: entity.userId.toString(),
    }
  }
}
