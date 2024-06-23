import { ProjectsRepository } from '@modules/projects/repositories/Projects.repository'
import { PrismaContext, PrismaService } from '../Prisma.service'
import { Project } from '@modules/projects/entities/Project'
import { Injectable } from '@nestjs/common'
import { ProjectsPrismaMapper } from './ProjectsPrisma.mapper'
import { DomainEvents } from '@shared/core/events/DomainEvents'

@Injectable()
export class ProjectsPrismaRepository
  implements ProjectsRepository<PrismaContext>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: ProjectsPrismaMapper,
  ) {}

  async findManyByUserId(
    userId: string,
    ctx?: PrismaContext | undefined,
  ): Promise<Project[]> {
    const db = ctx?.prisma || this.prisma

    const projects = await db.project.findMany({
      where: { userId, deletedAt: null },
    })

    return projects.map(this.mapper.toDomain)
  }

  async create(data: Project, ctx?: PrismaContext | undefined): Promise<void> {
    const db = ctx?.prisma || this.prisma

    await db.project.create({ data: this.mapper.toPersistence(data) })

    DomainEvents.dispatchEventsForAggregate(data.id)
  }

  async findById(
    id: string,
    ctx?: PrismaContext | undefined,
  ): Promise<Project | null> {
    const db = ctx?.prisma || this.prisma

    const project = await db.project.findUnique({ where: { id } })

    if (!project) return null

    return this.mapper.toDomain(project)
  }

  findAll(_ctx?: PrismaContext | undefined): Promise<Project[]> {
    throw new Error('Method not implemented.')
  }

  async save(data: Project, ctx?: PrismaContext | undefined): Promise<void> {
    const db = ctx?.prisma || this.prisma

    await db.project.update({
      where: { id: data.id.toString() },
      data: this.mapper.toPersistence(data),
    })
  }

  delete(_id: string, _ctx?: PrismaContext | undefined): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
