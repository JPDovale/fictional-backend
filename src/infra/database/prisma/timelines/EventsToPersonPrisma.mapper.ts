import {
  EventToPerson,
  EventToPersonType,
} from '@modules/timelines/entities/EventToPerson'
import { Injectable } from '@nestjs/common'
import { PersonEvent as EventToPersonFile } from '@prisma/client'
import { RepositoryMapper } from '@shared/core/contracts/Repository'
import { UniqueId } from '@shared/core/valueObjects/UniqueId'

@Injectable()
export class EventsToPersonPrismaMapper extends RepositoryMapper<
  EventToPerson,
  EventToPersonFile
> {
  toDomain(raw: EventToPersonFile): EventToPerson {
    return EventToPerson.create(
      {
        type: raw.type as EventToPersonType,
        eventId: UniqueId.create(raw.eventId),
        personId: UniqueId.create(raw.personId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        trashedAt: raw.deletedAt,
      },
      UniqueId.create(raw.id),
    )
  }

  toPersistence(entity: EventToPerson): EventToPersonFile {
    return {
      id: entity.id.toString(),
      eventId: entity.eventId.toString(),
      personId: entity.personId.toString(),
      type: entity.type,
      deletedAt: entity.trashedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }
}
