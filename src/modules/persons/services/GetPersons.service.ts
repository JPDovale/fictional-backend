import { UserNotFound } from '@modules/users/errors/UserNotFound.error'
import { Service } from '@shared/core/contracts/Service'
import { Either, left, right } from '@shared/core/errors/Either'
import { UsersRepository } from '@modules/users/repositories/Users.repository'
import { ProjectNotFound } from '@modules/projects/errors/ProjectNotFound.error'
import { ProjectActionBlocked } from '@modules/projects/errors/ProjectActionBlocked.error'
import { ProjectsRepository } from '@modules/projects/repositories/Projects.repository'
import { BuildBlock } from '@modules/projects/valueObjects/BuildBlocks'
import { PersonsRepository } from '../repositories/Persons.repository'
import { PersonWithParents } from '../valuesObjects/PersonWithParents'
import { Injectable } from '@nestjs/common'

type Request = {
  projectId: string
  userId: string
}

type PossibleErrors = UserNotFound | ProjectNotFound | ProjectActionBlocked

type Response = {
  persons: PersonWithParents[]
}

@Injectable()
export class GetPersonsService
  implements Service<Request, PossibleErrors, Response>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly projectsRepository: ProjectsRepository,
    private readonly personsRepository: PersonsRepository,
  ) {}

  async execute({
    userId,
    projectId,
  }: Request): Promise<Either<UserNotFound, Response>> {
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

    if (!project.buildBlocks.implements(BuildBlock.PERSONS)) {
      return left(new ProjectActionBlocked())
    }

    const persons = await this.personsRepository.findManyWithParentsByProjectId(
      project.id.toString(),
    )

    return right({ persons })
  }
}
