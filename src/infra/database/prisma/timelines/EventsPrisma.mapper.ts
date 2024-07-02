import { Event, ImportanceLevel } from '@modules/timelines/entities/Event'
import { Event as EventFile, Prisma } from '@prisma/client'
import { EventDate } from '@modules/timelines/valueObjects/EventDate'
import { RepositoryMapper } from '@shared/core/contracts/Repository'
import { UniqueId } from '@shared/core/valueObjects/UniqueId'
import { Injectable } from '@nestjs/common'

@Injectable()
export class EventsPrismaMapper extends RepositoryMapper<
  Event,
  EventFile,
  Prisma.EventUncheckedCreateInput
> {
  toDomain(raw: EventFile): Event {
    return Event.create(
      {
        event: raw.event,
        date: EventDate.createFromString(raw.date),
        timelineId: UniqueId.create(raw.timelineId),
        importanceLevel: raw.importanceLevel as ImportanceLevel,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        trashedAt: raw.deletedAt,
        title: raw.title ?? raw.event,
      },
      UniqueId.create(raw.id),
    )
  }

  toPersistence(entity: Event): Prisma.EventUncheckedCreateInput {
    return {
      id: entity.id.toString(),
      event: entity.event,
      title: entity.title,
      importanceLevel: entity.importanceLevel,
      date: entity.date.toString(),
      timelineId: entity.timelineId.toString(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.trashedAt,
    }
  }
}
