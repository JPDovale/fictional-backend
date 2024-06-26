import { File as FileFile, Prisma } from '@prisma/client'
import { File } from '@modules/files/entities/File'
import { Injectable } from '@nestjs/common'
import { RepositoryMapper } from '@shared/core/contracts/Repository'
import { UniqueId } from '@shared/core/valueObjects/UniqueId'

@Injectable()
export class FilesPrismaMapper extends RepositoryMapper<
  File,
  FileFile,
  Prisma.FileUncheckedCreateInput
> {
  toDomain(raw: FileFile): File {
    return File.create(
      {
        title: raw.title,
        content: raw.content,
        projectId: UniqueId.create(raw.projectId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        trashedAt: raw.deletedAt,
        folderId: raw.folderId ? UniqueId.create(raw.folderId) : null,
      },
      UniqueId.create(raw.id),
    )
  }

  toPersistence(entity: File): FileFile {
    return {
      id: entity.id.toString(),
      title: entity.title,
      content: entity.content,
      projectId: entity.projectId.toString(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.trashedAt,
      folderId: entity.folderId?.toString() ?? null,
    }
  }
}
