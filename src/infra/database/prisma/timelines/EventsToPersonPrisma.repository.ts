import {
  EventsToPersonRepository,
  FindBirthAndDeathByPersonIdAndTimelineIdProps,
} from '@modules/timelines/repositories/EventsToPerson.repository'
import { EventToPerson } from '@modules/timelines/entities/EventToPerson'
import { PersonEvent as EventToPersonFile } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaContext, PrismaService } from '../Prisma.service'
import { EventsToPersonPrismaMapper } from './EventsToPersonPrisma.mapper'

@Injectable()
export class EventsToPersonPrismaRepository
  implements EventsToPersonRepository<PrismaContext>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: EventsToPersonPrismaMapper,
  ) {}

  async createMany(
    events: EventToPerson[],
    ctx?: PrismaContext,
  ): Promise<void> {
    const db = ctx?.prisma ?? this.prisma

    await db.personEvent.createMany({
      data: events.map(this.mapper.toPersistence),
    })
  }

  async findManyByPersonId(
    personId: string,
    ctx?: PrismaContext,
  ): Promise<EventToPerson[]> {
    const db = ctx?.prisma ?? this.prisma

    const eventsToPerson = await db.personEvent.findMany({
      where: {
        personId,
        deletedAt: null,
      },
    })

    return eventsToPerson.map(this.mapper.toDomain)
  }

  async findBirthAndDeathByPersonIdAndTimelineId(
    { personId, timelineId }: FindBirthAndDeathByPersonIdAndTimelineIdProps,
    ctx?: PrismaContext,
  ): Promise<EventToPerson[]> {
    const db = ctx?.prisma ?? this.prisma

    const personBirthAndDeathEnvets = await db.timeline.findUnique({
      where: {
        id: timelineId,
      },
      select: {
        events: {
          select: {
            personEvents: {
              where: {
                deletedAt: null,
                personId,
                type: {
                  in: ['BIRTH', 'DEATH'],
                },
              },
            },
          },
        },
      },
    })

    if (!personBirthAndDeathEnvets) return []

    const personEvents: EventToPersonFile[] = []

    personBirthAndDeathEnvets.events.forEach((event) => {
      event.personEvents.forEach((personEvent) => {
        personEvents.push(personEvent)
      })
    })

    return personEvents.map(this.mapper.toDomain)
  }

  async create(data: EventToPerson, ctx?: PrismaContext): Promise<void> {
    const db = ctx?.prisma ?? this.prisma

    await db.personEvent.create({
      data: this.mapper.toPersistence(data),
    })
  }

  findById(_id: string, _ctx?: PrismaContext): Promise<EventToPerson | null> {
    throw new Error('Method not implemented.')
  }

  findAll(_ctx?: PrismaContext): Promise<EventToPerson[]> {
    throw new Error('Method not implemented.')
  }

  async save(data: EventToPerson, ctx?: PrismaContext): Promise<void> {
    const db = ctx?.prisma ?? this.prisma

    await db.personEvent.update({
      where: {
        id: data.id.toString(),
      },
      data: this.mapper.toPersistence(data),
    })
  }

  delete(_id: string, _ctx?: PrismaContext): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
