import { Injectable } from '@nestjs/common'
import { Service } from '@shared/core/contracts/Service'
import { UserNotFound } from '@modules/users/errors/UserNotFound.error'
import { ProjectNotFound } from '@modules/projects/errors/ProjectNotFound.error'
import { Either, left, right } from '@shared/core/errors/Either'
import { UsersRepository } from '@modules/users/repositories/Users.repository'
import { ProjectsRepository } from '@modules/projects/repositories/Projects.repository'
import { FoldersRepository } from '../repositories/Folders.repository'
import { ProjectActionBlocked } from '@modules/projects/errors/ProjectActionBlocked.error'
import { FolderNotFound } from '../errors/FolderNotFound.error'
import { Folder } from '../entities/Folder'
import { TransactorService } from '@infra/database/transactor/contracts/Transactor.service'
import { File } from '@modules/files/entities/File'
import { FilesRepository } from '@modules/files/repositories/Files.repository'

interface Request {
  userId: string
  folderId: string
  projectId: string
}

type PossibleErrors =
  | UserNotFound
  | ProjectNotFound
  | ProjectActionBlocked
  | FolderNotFound

interface Response {
  folder: Folder
}

@Injectable()
export class DeleteFoldersService
  implements Service<Request, PossibleErrors, Response>
{
  constructor(
    private readonly transactor: TransactorService,
    private readonly usersRepository: UsersRepository,
    private readonly projectsRepository: ProjectsRepository,
    private readonly foldersRepository: FoldersRepository,
    private readonly filesRepository: FilesRepository,
  ) {}

  async execute({
    userId,
    projectId,
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

    if (!user.id.equals(project.userId)) {
      return left(new ProjectActionBlocked())
    }

    const folder = await this.foldersRepository.findById(folderId)
    if (!folder) {
      return left(new FolderNotFound())
    }

    const transaction = this.transactor.start()
    const foldersToUpdate: Folder[] = []
    const filesToUpdate: File[] = []

    function recursiveDelete(folder: Folder) {
      folder.moveToTrash()
      foldersToUpdate.push(folder)

      const foldersToDelete = folder.childs.getItems()
      const filesToDelete = folder.files.getItems()

      filesToDelete.forEach((file) => {
        file.moveToTrash()
        filesToUpdate.push(file)
      })

      foldersToDelete.forEach(recursiveDelete)
    }

    recursiveDelete(folder)

    transaction.add((ctx) =>
      this.foldersRepository.saveMany(foldersToUpdate, ctx),
    )
    transaction.add((ctx) => this.filesRepository.saveMany(filesToUpdate, ctx))

    await this.transactor.execute(transaction)

    return right({ folder })
  }
}
