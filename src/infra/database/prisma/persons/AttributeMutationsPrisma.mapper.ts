import { AttributeMutation } from '@modules/persons/entities/AttributeMutation'
import {
  AttributeMutation as AttributeMutationFile,
  Prisma,
} from '@prisma/client'
import { ImportanceLevel } from '@modules/timelines/entities/Event'
import { EventDate } from '@modules/timelines/valueObjects/EventDate'
import { Injectable } from '@nestjs/common'
import { RepositoryMapper } from '@shared/core/contracts/Repository'
import { UniqueId } from '@shared/core/valueObjects/UniqueId'

type AttributeMutationWithDateFile = AttributeMutationFile & {
  event: {
    date: string
    importanceLevel: number
  } | null
}

@Injectable()
export class AttributeMutationsPrismaMapper extends RepositoryMapper<
  AttributeMutation,
  AttributeMutationFile,
  Prisma.AttributeMutationUncheckedCreateInput
> {
  toDomain(raw: AttributeMutationWithDateFile): AttributeMutation {
    return AttributeMutation.create(
      {
        fileId: UniqueId.create(raw.fileId),
        title: raw.title,
        attributeId: UniqueId.create(raw.attributeId),
        position: raw.position,
        eventId: raw.eventId ? UniqueId.create(raw.eventId) : null,
        date: raw.event?.date
          ? EventDate.createFromString(raw.event.date)
          : null,
        importanceLevel: (raw.event?.importanceLevel ??
          null) as ImportanceLevel | null,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        trashedAt: raw.deletedAt,
      },
      UniqueId.create(raw.id),
    )
  }

  toPersistence(
    entity: AttributeMutation,
  ): Prisma.AttributeMutationUncheckedCreateInput {
    return {
      id: entity.id.toString(),
      title: entity.title,
      fileId: entity.fileId.toString(),
      attributeId: entity.attributeId.toString(),
      eventId: entity.eventId ? entity.eventId.toString() : null,
      position: entity.position,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.trashedAt,
    }
  }
}
