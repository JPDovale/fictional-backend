import { Injectable } from '@nestjs/common'
import { Service } from '@shared/core/contracts/Service'
import { Folder } from '../entities/Folder'
import { UserNotFound } from '@modules/users/errors/UserNotFound.error'
import { ProjectNotFound } from '@modules/projects/errors/ProjectNotFound.error'
import { Either, left, right } from '@shared/core/errors/Either'
import { UsersRepository } from '@modules/users/repositories/Users.repository'
import { ProjectsRepository } from '@modules/projects/repositories/Projects.repository'
import { FoldersRepository } from '../repositories/Folders.repository'
import { ProjectActionBlocked } from '@modules/projects/errors/ProjectActionBlocked.error'
import { FolderNotFound } from '../errors/FolderNotFound.error'

interface Request {
  parentId?: string
  userId: string
  projectId: string
}

type PossibleErrors = UserNotFound | ProjectNotFound | ProjectActionBlocked

interface Response {
  folder: Folder
}

@Injectable()
export class CreateFolderService
  implements Service<Request, PossibleErrors, Response>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly projectsRepository: ProjectsRepository,
    private readonly foldersRepository: FoldersRepository,
  ) {}

  async execute({
    userId,
    projectId,
    parentId,
  }: Request): Promise<Either<PossibleErrors, Response>> {
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      return left(new UserNotFound())
    }

    const project = await this.projectsRepository.findById(projectId)
    if (!project) {
      return left(new ProjectNotFound())
    }

    if (!user.id.equals(project.userId)) {
      return left(new ProjectActionBlocked())
    }

    let parent: Folder | null = null

    if (parentId) {
      parent = await this.foldersRepository.findById(parentId)
      if (!parent) {
        return left(new FolderNotFound())
      }

      if (!parent.projectId.equals(project.id)) {
        return left(new ProjectActionBlocked())
      }
    }

    const folder = Folder.create({
      parentId: parent?.id,
      projectId: project.id,
    })

    await this.foldersRepository.create(folder)

    return right({ folder })
  }
}
