import { UserNotFound } from '@modules/users/errors/UserNotFound.error'
import { Service } from '@shared/core/contracts/Service'
import { Either, left, right } from '@shared/core/errors/Either'
import { UsersRepository } from '@modules/users/repositories/Users.repository'
import { ProjectNotFound } from '@modules/projects/errors/ProjectNotFound.error'
import { ProjectActionBlocked } from '@modules/projects/errors/ProjectActionBlocked.error'
import { ProjectsRepository } from '@modules/projects/repositories/Projects.repository'
import { BuildBlock } from '@modules/projects/valueObjects/BuildBlocks'
import { PersonsRepository } from '../repositories/Persons.repository'
import { PersonNotFound } from '../errors/PersonNotFound.error'
import { Person } from '../entities/Person'
import { AffiliationsRepository } from '@modules/affiliations/repositories/Affiliations.repository'
import { TransactorService } from '@infra/database/transactor/contracts/Transactor.service'
import { EventsRepository } from '@modules/timelines/repositories/Events.repository'
import { Injectable } from '@nestjs/common'

type Request = {
  projectId: string
  userId: string
  personId: string
}

type PossibleErrors =
  | UserNotFound
  | ProjectNotFound
  | ProjectActionBlocked
  | PersonNotFound

type Response = {
  person: Person
}

@Injectable()
export class DeletePersonService
  implements Service<Request, PossibleErrors, Response>
{
  constructor(
    private readonly transactor: TransactorService,
    private readonly usersRepository: UsersRepository,
    private readonly projectsRepository: ProjectsRepository,
    private readonly personsRepository: PersonsRepository,
    private readonly eventsRepository: EventsRepository,
    private readonly affiliationsRepository: AffiliationsRepository,
  ) {}

  async execute({
    userId,
    projectId,
    personId,
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

    const person = await this.personsRepository.findById(personId)
    if (!person) {
      return left(new PersonNotFound())
    }

    if (!person.projectId.equals(project.id)) {
      return left(new ProjectActionBlocked())
    }

    const events = await this.eventsRepository.findManyByPersonId(
      person.id.toString(),
    )

    const affiliations =
      await this.affiliationsRepository.findByPersonId(personId)

    affiliations.forEach((affiliation) => {
      if (affiliation.fatherId?.equals(person.id)) {
        affiliation.fatherId = null
      }

      if (affiliation.motherId?.equals(person.id)) {
        affiliation.motherId = null
      }
    })

    events.forEach((event) => {
      event.moveToTrash()
    })

    person.moveToTrash()

    const transaction = this.transactor.start()

    transaction.add((ctx) =>
      this.affiliationsRepository.saveMany(affiliations, ctx),
    )
    transaction.add((ctx) => this.eventsRepository.saveMany(events, ctx))
    transaction.add((ctx) => this.personsRepository.save(person, ctx))

    await this.transactor.execute(transaction)

    return right({ person })
  }
}
