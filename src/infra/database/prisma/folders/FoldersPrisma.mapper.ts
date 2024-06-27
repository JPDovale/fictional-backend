import { Folder } from '@modules/folders/entities/Folder'
import { Folder as FolderFile, Prisma, File as FileFile } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { RepositoryMapper } from '@shared/core/contracts/Repository'
import { UniqueId } from '@shared/core/valueObjects/UniqueId'
import { FolderChildsList } from '@modules/folders/entities/FolderChildsList'
import { FolderWithChilds } from '@modules/folders/valueObjects/FolderWithChilds'
import { FilesPrismaMapper } from '../files/FilesPrisma.mapper'
import { FolderFilesList } from '@modules/folders/entities/FolderFilesList'

export interface FolderWithChildsFile extends FolderFile {
  childs: FolderWithChildsFile[]
  files: {
    id: string
    title: string
  }[]
}

interface FolderWithChildsAndFilesFile extends FolderFile {
  childs: FolderFile[]
  files: FileFile[]
}

@Injectable()
export class FoldersPrismaMapper extends RepositoryMapper<
  Folder,
  FolderFile,
  Prisma.FolderUncheckedCreateInput
> {
  constructor(private readonly filesMapper: FilesPrismaMapper) {
    super()
  }

  toDomain(raw: FolderFile): Folder {
    return Folder.create(
      {
        name: raw.name,
        parentId: raw.parentId ? UniqueId.create(raw.parentId) : null,
        projectId: UniqueId.create(raw.projectId),
        childs: new FolderChildsList([]),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        trashedAt: raw.deletedAt,
      },
      UniqueId.create(raw.id),
    )
  }

  toPersistence(entity: Folder): FolderFile {
    return {
      id: entity.id.toString(),
      name: entity.name,
      parentId: entity.parentId ? entity.parentId.toString() : null,
      projectId: entity.projectId.toString(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.trashedAt,
    }
  }

  toDomainWithChilds(raw: FolderWithChildsFile): FolderWithChilds {
    function map(raw: FolderWithChildsFile): FolderWithChilds {
      return FolderWithChilds.create({
        id: UniqueId.create(raw.id),
        projectId: UniqueId.create(raw.projectId),
        updatedAt: raw.updatedAt,
        createdAt: raw.createdAt,
        name: raw.name,
        parentId: raw.parentId ? UniqueId.create(raw.parentId) : null,
        files: raw.files.map((file) => ({
          id: UniqueId.create(file.id),
          title: file.title,
        })),
        childs: raw.childs.map(map),
      })
    }

    return map(raw)
  }

  toDomainWihtChildsAndFiles(raw: FolderWithChildsAndFilesFile): Folder {
    const toFileDomain = this.filesMapper.toDomain

    function map(raw: FolderWithChildsAndFilesFile): Folder {
      return Folder.create(
        {
          name: raw.name,
          parentId: raw.parentId ? UniqueId.create(raw.parentId) : null,
          projectId: UniqueId.create(raw.projectId),
          childs: new FolderChildsList(raw.childs?.map(map)),
          files: new FolderFilesList(raw.files?.map(toFileDomain)),
          createdAt: raw.createdAt,
          updatedAt: raw.updatedAt,
          trashedAt: raw.deletedAt,
        },
        UniqueId.create(raw.id),
      )
    }

    return map(raw)
  }
}
