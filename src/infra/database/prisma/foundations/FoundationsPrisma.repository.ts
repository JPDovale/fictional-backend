import { Foundation } from '@modules/foundations/entities/Foundation'
import { FoundationsRepository } from '@modules/foundations/repositories/Foundations.repository'
import { Injectable } from '@nestjs/common'
import { PrismaContext, PrismaService } from '../Prisma.service'
import { FoundationsPrismaMapper } from './FoundationsPrisma.mapper'

@Injectable()
export class FoundationsPrismaRepository
  implements FoundationsRepository<PrismaContext>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: FoundationsPrismaMapper,
  ) {}

  async create(foundation: Foundation, ctx?: PrismaContext): Promise<void> {
    const db = ctx?.prisma ?? this.prisma

    await db.foundation.create({
      data: this.mapper.toPersistence(foundation),
    })
  }

  async findById(id: string, ctx?: PrismaContext): Promise<Foundation | null> {
    const db = ctx?.prisma ?? this.prisma

    const foundation = await db.foundation.findUnique({
      where: { id },
    })

    if (!foundation) return null

    return this.mapper.toDomain(foundation)
  }

  findAll(): Promise<Foundation[]> {
    throw new Error('Method not implemented.')
  }

  async save(foundation: Foundation, ctx?: PrismaContext): Promise<void> {
    const db = ctx?.prisma ?? this.prisma

    await db.foundation.update({
      where: { id: foundation.id.toString() },
      data: this.mapper.toPersistence(foundation),
    })
  }

  delete(_id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findByProjectId(
    projectId: string,
    ctx?: PrismaContext,
  ): Promise<Foundation | null> {
    const db = ctx?.prisma ?? this.prisma

    const foundation = await db.foundation.findFirst({
      where: { projectId },
    })

    if (!foundation) return null

    return this.mapper.toDomain(foundation)
  }
}
