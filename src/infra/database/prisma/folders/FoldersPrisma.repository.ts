import { Injectable } from '@nestjs/common'
import { PrismaContext, PrismaService } from '../Prisma.service'
import { FoldersRepository } from '@modules/folders/repositories/Folders.repository'
import {
  FolderWithChildsFile,
  FoldersPrismaMapper,
} from './FoldersPrisma.mapper'
import { Folder } from '@modules/folders/entities/Folder'
import { FolderWithChilds } from '@modules/folders/valueObjects/FolderWithChilds'

@Injectable()
export class FoldersPrismaRepository
  implements FoldersRepository<PrismaContext>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: FoldersPrismaMapper,
  ) {}

  async create(data: Folder, ctx?: PrismaContext): Promise<void> {
    const db = ctx?.prisma ?? this.prisma

    await db.folder.create({
      data: this.mapper.toPersistence(data),
    })
  }

  async findById(id: string, ctx?: PrismaContext): Promise<Folder | null> {
    const db = ctx?.prisma ?? this.prisma

    const folder = await db.folder.findUnique({ where: { id } })

    if (!folder) return null

    return this.mapper.toDomain(folder)
  }

  findAll(_ctx?: PrismaContext): Promise<Folder[]> {
    throw new Error('Method not implemented.')
  }

  async save(data: Folder, ctx?: PrismaContext): Promise<void> {
    const db = ctx?.prisma ?? this.prisma

    await db.folder.update({
      where: { id: data.id.toString() },
      data: this.mapper.toPersistence(data),
    })
  }

  async getManyByProjectId(
    projectId: string,
    ctx?: PrismaContext | undefined,
  ): Promise<FolderWithChilds[]> {
    const db = ctx?.prisma ?? this.prisma

    const foldersQuery = await db.folder.findMany({
      where: {
        projectId,
      },
      orderBy: {
        name: 'asc',
      },
      include: {
        files: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    function buildHierarchy(
      folders: typeof foldersQuery,
      parentId: string | null = null,
    ): FolderWithChildsFile[] {
      return folders
        .filter((folder) => folder.parentId === parentId)
        .map((folder) => ({
          id: folder.id,
          name: folder.name,
          parentId: folder.parentId,
          projectId: folder.projectId,
          createdAt: folder.createdAt,
          updatedAt: folder.updatedAt,
          deletedAt: folder.deletedAt,
          files: folder.files,
          childs: buildHierarchy(folders, folder.id),
        }))
    }

    const folders = buildHierarchy(foldersQuery)

    return folders.map(this.mapper.toDomainWithChilds)
  }

  delete(_id: string, _ctx?: PrismaContext): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
