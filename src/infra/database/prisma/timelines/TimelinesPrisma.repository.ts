import { Timeline } from '@modules/timelines/entities/Timeline'
import { TimelinesRepository } from '@modules/timelines/repositories/Timelines.repository'
import { Injectable } from '@nestjs/common'
import { PrismaContext, PrismaService } from '../Prisma.service'
import { TimelinesPrismaMapper } from './TimelinesPrisma.mapper'

@Injectable()
export class TimelinesPrismaRepository
  implements TimelinesRepository<PrismaContext>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: TimelinesPrismaMapper,
  ) {}

  async findByProjectId(
    projectId: string,
    ctx?: PrismaContext,
  ): Promise<Timeline | null> {
    const db = ctx?.prisma ?? this.prisma

    const timeline = await db.timeline.findFirst({
      where: { projectId },
    })

    if (!timeline) return null

    return this.mapper.toDomain(timeline)
  }

  async findManyByProjectId(
    projectId: string,
    ctx?: PrismaContext,
  ): Promise<Timeline[]> {
    const db = ctx?.prisma ?? this.prisma

    const timelines = await db.timeline.findMany({
      where: { projectId },
    })

    return timelines.map(this.mapper.toDomain)
  }

  async findWithEventsById(
    id: string,
    ctx?: PrismaContext,
  ): Promise<Timeline | null> {
    const db = ctx?.prisma ?? this.prisma

    const timeline = await db.timeline.findFirst({
      where: { id },
      include: {
        events: {
          where: {
            deletedAt: null,
          },
        },
      },
    })

    if (!timeline) return null

    return this.mapper.toDomainWithEvents(timeline)
  }

  async create(data: Timeline, ctx?: PrismaContext): Promise<void> {
    const db = ctx?.prisma ?? this.prisma

    await db.timeline.create({
      data: this.mapper.toPersistence(data),
    })
  }

  async findById(id: string, ctx?: PrismaContext): Promise<Timeline | null> {
    const db = ctx?.prisma ?? this.prisma

    const timeline = await db.timeline.findFirst({
      where: { id },
    })

    if (!timeline) return null

    return this.mapper.toDomain(timeline)
  }

  findAll(_ctx?: PrismaContext): Promise<Timeline[]> {
    throw new Error('Method not implemented.')
  }

  save(_data: Timeline, _ctx?: PrismaContext): Promise<void> {
    throw new Error('Method not implemented.')
  }

  delete(_id: string, _ctx?: PrismaContext): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
