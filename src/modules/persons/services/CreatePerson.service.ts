import { UserNotFound } from '@modules/users/errors/UserNotFound.error'
import { Service } from '@shared/core/contracts/Service'
import { Either, left, right } from '@shared/core/errors/Either'
import { UsersRepository } from '@modules/users/repositories/Users.repository'
import { CannotGetSafeLocationForImage } from '@providers/base/images/errors/CannotGetSafeLocationForImage.error'
import { ProjectNotFound } from '@modules/projects/errors/ProjectNotFound.error'
import { ProjectsRepository } from '@modules/projects/repositories/Projects.repository'
import { ProjectActionBlocked } from '@modules/projects/errors/ProjectActionBlocked.error'
import { AffiliationNotFound } from '@modules/affiliations/errors/AffiliationNotFound.error'
import { UniqueId } from '@shared/core/valueObjects/UniqueId'
import { BuildBlock } from '@modules/projects/valueObjects/BuildBlocks'
import { CreateAffiliationService } from '@modules/affiliations/services/CreateAffiliation.service'
import { GetAffiliationByParentsIdService } from '@modules/affiliations/services/GetAffiliationByParentsId.service'
import { EventToPersonType } from '@modules/timelines/entities/EventToPerson'
import { Person } from '../entities/Person'
import { PersonsRepository } from '../repositories/Persons.repository'
import { PersonType } from '../entities/types'
import { Injectable } from '@nestjs/common'
import { CreateManyPersonEventsForDefaultTimelineService } from '@modules/timelines/services/CreateManyPersonEventsForDefaultTimeline.service'

type Request = {
  name?: string
  image?: string
  birthDate?: string
  deathDate?: string
  type: PersonType
  fatherId?: string
  motherId?: string
  projectId: string
  userId: string
}

type PossibleErrors =
  | UserNotFound
  | CannotGetSafeLocationForImage
  | ProjectNotFound
  | ProjectActionBlocked
  | AffiliationNotFound

type Response = {
  person: Person
}

@Injectable()
export class CreatePersonService
  implements Service<Request, PossibleErrors, Response>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly projectsRepository: ProjectsRepository,
    private readonly personsRepository: PersonsRepository,
    private readonly getAffiliationByParentsIdService: GetAffiliationByParentsIdService,
    private readonly createAffiliationService: CreateAffiliationService,
    private readonly createManyPersonEventsForDefaultTimelineService: CreateManyPersonEventsForDefaultTimelineService,
  ) {}

  async execute({
    name,
    image,
    birthDate,
    deathDate,
    type,
    fatherId,
    motherId,
    projectId,
    userId,
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

    if (!project.buildBlocks.implements(BuildBlock.PERSONS)) {
      return left(new ProjectActionBlocked())
    }

    let affiliationId: UniqueId | null = null

    if (fatherId || motherId) {
      const affiliationResposne =
        await this.getAffiliationByParentsIdService.execute({
          fatherId,
          motherId,
        })

      if (
        affiliationResposne.isLeft() &&
        !(affiliationResposne.value instanceof AffiliationNotFound)
      ) {
        return left(affiliationResposne.value)
      }

      if (affiliationResposne.isRight()) {
        const { affiliation } = affiliationResposne.value
        affiliationId = affiliation.id
      }
    }

    if ((fatherId || motherId) && !affiliationId) {
      const createAffiliationResponse =
        await this.createAffiliationService.execute({
          motherId,
          fatherId,
        })

      if (createAffiliationResponse.isLeft()) {
        return left(createAffiliationResponse.value)
      }

      const { affiliation } = createAffiliationResponse.value
      affiliationId = affiliation.id
    }

    const person = Person.create({
      name,
      projectId: project.id,
      affiliationId,
      image,
      type,
    })

    await this.personsRepository.create(person)

    if (project.buildBlocks.implements(BuildBlock.TIME_LINES)) {
      const events: {
        date: string
        event: string
        type: EventToPersonType
        title: string
      }[] = []

      if (birthDate) {
        events.push({
          title: `Nascimento de $=${person.id.toString()}=pers$=`,
          date: birthDate,
          event: `Nascimento de $=${person.id.toString()}=pers$=`,
          type: EventToPersonType.BIRTH,
        })
      }

      if (deathDate) {
        events.push({
          title: `Morte de $=${person.id.toString()}=pers$=`,
          date: deathDate,
          event: `Morte de $=${person.id.toString()}=pers$=`,
          type: EventToPersonType.DEATH,
        })
      }

      await this.createManyPersonEventsForDefaultTimelineService.execute({
        eventsReceived: events,
        person,
      })
    }

    return right({ person })
  }
}
