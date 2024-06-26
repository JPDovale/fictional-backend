import { UserNotFound } from '@modules/users/errors/UserNotFound.error'
import { Service } from '@shared/core/contracts/Service'
import { Either, left, right } from '@shared/core/errors/Either'
import { UsersRepository } from '@modules/users/repositories/Users.repository'
import { ProjectNotFound } from '@modules/projects/errors/ProjectNotFound.error'
import { ProjectsRepository } from '@modules/projects/repositories/Projects.repository'
import { ProjectActionBlocked } from '@modules/projects/errors/ProjectActionBlocked.error'
import { FileNotFound } from '../errors/FileNotFound.error'
import { File } from '../entities/File'
import { FilesRepository } from '../repositories/Files.repository'
import { Injectable } from '@nestjs/common'
import { FoldersRepository } from '@modules/folders/repositories/Folders.repository'
import { FolderNotFound } from '@modules/folders/errors/FolderNotFound.error'
import { UniqueId } from '@shared/core/valueObjects/UniqueId'

type Request = {
  folderId?: string
  projectId: string
  userId: string
}

type PossibleErrors =
  | UserNotFound
  | ProjectNotFound
  | ProjectActionBlocked
  | FileNotFound
  | FolderNotFound

type Response = {
  file: File
}

@Injectable()
export class CreateFileService
  implements Service<Request, PossibleErrors, Response>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly projectsRepository: ProjectsRepository,
    private readonly filesRepository: FilesRepository,
    private readonly foldersRepository: FoldersRepository,
  ) {}

  async execute({
    projectId,
    userId,
    folderId,
  }: Request): Promise<Either<PossibleErrors, Response>> {
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      return left(new UserNotFound())
    }

    const project = await this.projectsRepository.findById(projectId)
    if (!project) {
      return left(new ProjectNotFound())
    }

    if (!project.userId.equals(user.id)) {
      return left(new ProjectActionBlocked())
    }

    if (folderId) {
      const folder = await this.foldersRepository.findById(folderId)
      if (!folder) {
        return left(new FolderNotFound())
      }
    }

    const file = File.create({
      projectId: project.id,
      folderId: folderId ? UniqueId.create(folderId) : undefined,
    })

    await this.filesRepository.create(file)

    return right({ file })
  }
}
