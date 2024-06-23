import { Affiliation } from '@modules/affiliations/entities/Affiliation'
import { Affiliation as AffiliationFile, Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { RepositoryMapper } from '@shared/core/contracts/Repository'
import { UniqueId } from '@shared/core/valueObjects/UniqueId'

@Injectable()
export class AffiliationsPrismaMapper extends RepositoryMapper<
  Affiliation,
  AffiliationFile,
  Prisma.AffiliationUncheckedCreateInput
> {
  toDomain(raw: AffiliationFile): Affiliation {
    return Affiliation.create(
      {
        fatherId: raw.fatherId ? UniqueId.create(raw.fatherId) : null,
        motherId: raw.motherId ? UniqueId.create(raw.motherId) : null,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        trashedAt: raw.deletedAt,
      },
      UniqueId.create(raw.id),
    )
  }

  toPersistence(entity: Affiliation): Prisma.AffiliationUncheckedCreateInput {
    if (!entity.motherId && !entity.fatherId) {
      throw new Error('motherId and fatherId are null')
    }

    return {
      id: entity.id.toString(),
      fatherId: entity.fatherId?.toString() ?? null,
      motherId: entity.motherId?.toString() ?? null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.trashedAt,
    }
  }
}
