import { Timeline } from '@modules/timelines/entities/Timeline'
import {
  Timeline as TimelineFile,
  Event as EventFile,
  Prisma,
} from '@prisma/client'
import { RepositoryMapper } from '@shared/core/contracts/Repository'
import { UniqueId } from '@shared/core/valueObjects/UniqueId'
import { TimelineEventsList } from '@modules/timelines/entities/TimelineEventsList'
import { Injectable } from '@nestjs/common'
import { EventsPrismaMapper } from './EventsPrisma.mapper'

export interface TimelineWithEventsFile extends TimelineFile {
  events: EventFile[]
}

@Injectable()
export class TimelinesPrismaMapper extends RepositoryMapper<
  Timeline,
  TimelineFile,
  Prisma.TimelineUncheckedCreateInput
> {
  constructor(private readonly eventsMapper: EventsPrismaMapper) {
    super()
  }

  toDomain(raw: TimelineFile): Timeline {
    return Timeline.create(
      {
        name: raw.name,
        projectId: UniqueId.create(raw.projectId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        trashedAt: raw.deletedAt,
      },
      UniqueId.create(raw.id),
    )
  }

  toDomainWithEvents(raw: TimelineWithEventsFile): Timeline {
    return Timeline.create(
      {
        name: raw.name,
        projectId: UniqueId.create(raw.projectId),
        events: new TimelineEventsList(
          raw.events.map(this.eventsMapper.toDomain),
        ),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        trashedAt: raw.deletedAt,
      },
      UniqueId.create(raw.id),
    )
  }

  toPersistence(entity: Timeline): Prisma.TimelineUncheckedCreateInput {
    return {
      id: entity.id.toString(),
      name: entity.name,
      projectId: entity.projectId.toString(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.trashedAt,
    }
  }
}
