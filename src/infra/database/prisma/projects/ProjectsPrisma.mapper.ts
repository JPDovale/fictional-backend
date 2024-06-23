import { Prisma, Project as ProjectFile } from '@prisma/client'
import {
  Project,
  ProjectStructureType,
  ProjectType,
} from '@modules/projects/entities/Project'
import { Injectable } from '@nestjs/common'
import { RepositoryMapper } from '@shared/core/contracts/Repository'
import { UniqueId } from '@shared/core/valueObjects/UniqueId'
import { BuildBlocks } from '@modules/projects/valueObjects/BuildBlocks'

@Injectable()
export class ProjectsPrismaMapper
  implements
    RepositoryMapper<Project, ProjectFile, Prisma.ProjectUncheckedCreateInput>
{
  toDomain(raw: ProjectFile): Project {
    return Project.create(
      {
        name: raw.name,
        type: raw.type as ProjectType,
        userId: UniqueId.create(raw.userId),
        image: raw.imageUrl,
        createdAt: raw.createdAt,
        trashedAt: raw.deletedAt,
        updatedAt: raw.updatedAt,
        buildBlocks: BuildBlocks.createFromString(raw.buildBlocks),
        structureType: raw.structureType as ProjectStructureType,
      },
      UniqueId.create(raw.id),
    )
  }

  toPersistence(entity: Project): Prisma.ProjectUncheckedCreateInput {
    return {
      type: entity.type,
      id: entity.id.toString(),
      name: entity.name,
      userId: entity.userId.toString(),
      buildBlocks: entity.buildBlocks.toString(),
      imageUrl: entity.image,
      updatedAt: entity.updatedAt,
      createdAt: entity.createdAt,
      deletedAt: entity.trashedAt,
      structureType: entity.structureType,
    }
  }
}
