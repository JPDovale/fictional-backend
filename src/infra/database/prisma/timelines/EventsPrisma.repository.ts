import { Event } from '@modules/timelines/entities/Event'
import { Event as EventFile } from '@prisma/client'
import { EventsRepository } from '@modules/timelines/repositories/Events.repository'
import { Injectable } from '@nestjs/common'
import { PrismaContext, PrismaService } from '../Prisma.service'
import { EventsPrismaMapper } from './EventsPrisma.mapper'

@Injectable()
export class EventsPrismaRepository implements EventsRepository<PrismaContext> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: EventsPrismaMapper,
  ) {}

  async createMany(events: Event[], ctx?: PrismaContext): Promise<void> {
    const db = ctx?.prisma ?? this.prisma

    await db.event.createMany({
      data: events.map(this.mapper.toPersistence),
    })
  }

  async findManyByIds(ids: string[], ctx?: PrismaContext): Promise<Event[]> {
    const db = ctx?.prisma ?? this.prisma

    const events = await db.event.findMany({
      where: {
        id: { in: ids },
      },
    })

    return events.map(this.mapper.toDomain)
  }

  async saveMany(events: Event[], ctx?: PrismaContext): Promise<void> {
    const db = ctx?.prisma ?? this.prisma

    const updatesPromises = events.map((event) =>
      db.event.update({
        where: {
          id: event.id.toString(),
        },
        data: this.mapper.toPersistence(event),
      }),
    )

    await Promise.all(updatesPromises)
  }

  async create(data: Event, ctx?: PrismaContext): Promise<void> {
    const db = ctx?.prisma ?? this.prisma

    await db.event.create({
      data: this.mapper.toPersistence(data),
    })
  }

  async findBirthAndDeathByPersonId(
    personId: string,
    ctx?: PrismaContext,
  ): Promise<Event[]> {
    const db = ctx?.prisma ?? this.prisma

    const personBirthAndDeathEnvets = await db.person.findUnique({
      where: {
        id: personId,
      },
      select: {
        events: {
          select: {
            event: true,
          },
          where: {
            deletedAt: null,
            type: {
              in: ['BIRTH', 'DEATH'],
            },
          },
        },
      },
    })

    if (!personBirthAndDeathEnvets) return []

    const events = personBirthAndDeathEnvets.events.map((event) => event.event)

    return events.map(this.mapper.toDomain)
  }

  async findManyByPersonId(
    personId: string,
    ctx?: PrismaContext,
  ): Promise<Event[]> {
    const db = ctx?.prisma ?? this.prisma

    const eventsRelatedWithPerson = await db.person.findUnique({
      where: {
        id: personId,
      },
      select: {
        attributes: {
          select: {
            mutations: {
              where: {
                NOT: {
                  event: null,
                },
              },
              select: {
                event: true,
              },
            },
          },
        },
        events: {
          select: {
            event: true,
          },
          where: {
            deletedAt: null,
          },
        },
      },
    })

    const events: EventFile[] = []

    eventsRelatedWithPerson?.events.forEach((event) => {
      events.push(event.event)
    })

    eventsRelatedWithPerson?.attributes.forEach((attr) => {
      attr.mutations.forEach((mut) => {
        if (mut.event) events.push(mut.event)
      })
    })

    return events.map(this.mapper.toDomain)
  }

  async findManyByAttributeId(
    attributeId: string,
    ctx?: PrismaContext,
  ): Promise<Event[]> {
    const db = ctx?.prisma ?? this.prisma

    const eventsRelatedWithAttribute = await db.attribute.findUnique({
      where: {
        id: attributeId,
      },
      select: {
        mutations: {
          select: {
            event: true,
          },
        },
      },
    })

    const events: EventFile[] = []

    eventsRelatedWithAttribute?.mutations.forEach((mut) => {
      if (mut.event) events.push(mut.event)
    })

    return events.map(this.mapper.toDomain)
  }

  async findById(id: string, ctx?: PrismaContext): Promise<Event | null> {
    const db = ctx?.prisma ?? this.prisma

    const event = await db.event.findUnique({
      where: {
        id,
      },
    })

    if (!event) return null

    return this.mapper.toDomain(event)
  }

  findAll(_ctx?: PrismaContext): Promise<Event[]> {
    throw new Error('Method not implemented.')
  }

  async save(data: Event, ctx?: PrismaContext): Promise<void> {
    const db = ctx?.prisma ?? this.prisma

    await db.event.update({
      where: { id: data.id.toString() },
      data: this.mapper.toPersistence(data),
    })
  }

  delete(_id: string, _ctx?: PrismaContext): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
