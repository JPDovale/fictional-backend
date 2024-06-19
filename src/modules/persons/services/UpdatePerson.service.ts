import { UserNotFound } from '@modules/users/errors/UserNotFound.error'
import { Service } from '@shared/core/contracts/Service'
import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@shared/core/errors/Either'
import { UsersRepository } from '@modules/users/repositories/Users.repository'
import { ImagesManipulatorProvider } from '@providers/base/images/contracts/ImagesManipulator.provider'
import { CannotGetSafeLocationForImage } from '@providers/base/images/errors/CannotGetSafeLocationForImage.error'
import { ProjectNotFound } from '@modules/projects/errors/ProjectNotFound.error'
import { ProjectsRepository } from '@modules/projects/repositories/Projects.repository'
import { ProjectActionBlocked } from '@modules/projects/errors/ProjectActionBlocked.error'
import { AffiliationNotFound } from '@modules/affiliations/errors/AffiliationNotFound.error'
import { UniqueId } from '@shared/core/valueObjects/UniqueId'
import { BuildBlock } from '@modules/projects/valueObjects/BuildBlocks'
import { CreateAffiliationService } from '@modules/affiliations/services/CreateAffiliation.service'
import { GetAffiliationByParentsIdService } from '@modules/affiliations/services/GetAffiliationByParentsId.service'
import { Person } from '../entities/Person'
import { PersonsRepository } from '../repositories/Persons.repository'
import { PersonType } from '../entities/types'
import { PersonNotFound } from '../errors/PersonNotFound.error'

type Request = {
  name?: string | null
  history?: string | null
  image?: string | null
  birthDate?: string | null
  deathDate?: string | null
  type?: PersonType | null
  fatherId?: string | null
  motherId?: string | null
  projectId: string
  userId: string
  personId: string
}

type PossibleErrors =
  | UserNotFound
  | CannotGetSafeLocationForImage
  | ProjectNotFound
  | ProjectActionBlocked
  | AffiliationNotFound
  | PersonNotFound

type Response = {
  person: Person
}

@Injectable()
export class UpdatePersonService
  implements Service<Request, PossibleErrors, Response>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly projectsRepository: ProjectsRepository,
    private readonly personsRepository: PersonsRepository,
    private readonly ImagesManipulatorProvider: ImagesManipulatorProvider,
    private readonly getAffiliationByParentsIdService: GetAffiliationByParentsIdService,
    private readonly createAffiliationService: CreateAffiliationService,
  ) {}

  async execute({
    name,
    image,
    birthDate,
    deathDate,
    type,
    history,
    fatherId,
    motherId,
    projectId,
    userId,
    personId,
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

    const person = await this.personsRepository.findById(personId)
    if (!person) {
      return left(new PersonNotFound())
    }

    if (!person.projectId.equals(project.id)) {
      return left(new ProjectActionBlocked())
    }

    let affiliationId: UniqueId | null = null

    if (fatherId || motherId) {
      const affiliationResposne =
        await this.getAffiliationByParentsIdService.execute({
          fatherId: fatherId ?? undefined,
          motherId: motherId ?? undefined,
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
          motherId: motherId ?? undefined,
          fatherId: fatherId ?? undefined,
        })

      if (createAffiliationResponse.isLeft()) {
        return left(createAffiliationResponse.value)
      }

      const { affiliation } = createAffiliationResponse.value
      affiliationId = affiliation.id
    }

    const imageSecure = await this.ImagesManipulatorProvider.getImage(
      image ?? undefined,
    )

    if (image && !imageSecure) {
      return left(new CannotGetSafeLocationForImage())
    }

    if (image && imageSecure) {
      await imageSecure.copyToSecure()
    }

    const oldType = person.type

    person.name = name
    person.image = imageSecure?.savedName
    person.type = type ?? undefined
    person.history = history
    person.affiliationId = affiliationId ?? undefined

    if (project.buildBlocks.implements(BuildBlock.TIME_LINES)) {
      if (oldType !== type) {
        person.addPersonInfosUsedInEventsUpdatedEvent()
      }

      if (!(birthDate === undefined && deathDate === undefined)) {
        person.addPersonBirthOrDeathDateUpdateEvent({
          birthDate,
          deathDate,
        })
      }
    }

    await this.personsRepository.save(person)

    return right({ person })
  }
}
