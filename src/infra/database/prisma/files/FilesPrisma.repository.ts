import { FilesRepository } from '@modules/files/repositories/Files.repository'
import { Injectable } from '@nestjs/common'
import { PrismaContext, PrismaService } from '../Prisma.service'
import { FilesPrismaMapper } from './FilesPrisma.mapper'
import { File } from '@modules/files/entities/File'

@Injectable()
export class FilesPrismaRepository implements FilesRepository<PrismaContext> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: FilesPrismaMapper,
  ) {}

  async create(data: File, ctx?: PrismaContext): Promise<void> {
    const db = ctx?.prisma ?? this.prisma

    await db.file.create({
      data: this.mapper.toPersistence(data),
    })
  }

  async findById(id: string, ctx?: PrismaContext): Promise<File | null> {
    const db = ctx?.prisma ?? this.prisma

    const file = await db.file.findUnique({ where: { id } })

    if (!file) return null

    return this.mapper.toDomain(file)
  }

  findAll(_ctx?: PrismaContext): Promise<File[]> {
    throw new Error('Method not implemented.')
  }

  async save(data: File, ctx?: PrismaContext): Promise<void> {
    const db = ctx?.prisma ?? this.prisma

    await db.file.update({
      where: { id: data.id.toString() },
      data: this.mapper.toPersistence(data),
    })
  }

  delete(_id: string, _ctx?: PrismaContext): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
