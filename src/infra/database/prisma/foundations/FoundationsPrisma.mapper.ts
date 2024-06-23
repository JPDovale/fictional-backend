import { Foundation } from '@modules/foundations/entities/Foundation'
import { Foundation as FoundationFile, Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { RepositoryMapper } from '@shared/core/contracts/Repository'
import { UniqueId } from '@shared/core/valueObjects/UniqueId'

@Injectable()
export class FoundationsPrismaMapper
  implements
    RepositoryMapper<
      Foundation,
      FoundationFile,
      Prisma.FoundationUncheckedCreateInput
    >
{
  toDomain(raw: FoundationFile): Foundation {
    return Foundation.create(
      {
        foundation: raw.foundation ?? '',
        whereHappens: raw.where ?? '',
        whyHappens: raw.why ?? '',
        whoHappens: raw.who ?? '',
        whatHappens: raw.what ?? '',
        projectId: UniqueId.create(raw.projectId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        trashedAt: raw.deletedAt,
      },
      UniqueId.create(raw.id),
    )
  }

  toPersistence(entity: Foundation): FoundationFile {
    return {
      id: entity.id.toString(),
      foundation: entity.foundation,
      where: entity.whereHappens,
      why: entity.whyHappens,
      who: entity.whoHappens,
      what: entity.whatHappens,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.trashedAt,
      projectId: entity.projectId.toString(),
    }
  }
}
