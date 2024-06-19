import { Service } from '@shared/core/contracts/Service'
import { Either, left, right } from '@shared/core/errors/Either'
import { AffiliationsRepository } from '@modules/affiliations/repositories/Affiliations.repository'
import { ProjectActionBlocked } from '@modules/projects/errors/ProjectActionBlocked.error'
import { UniqueId } from '@shared/core/valueObjects/UniqueId'
import { PersonsRepository } from '@modules/persons/repositories/Persons.repository'
import { FatherNotFound } from '@modules/persons/errors/FatherNotFound.error'
import { MotherNotFound } from '@modules/persons/errors/MotherNotFound.error'
import { Affiliation } from '../entities/Affiliation'
import { Injectable } from '@nestjs/common'

type Request = {
  fatherId?: string
  motherId?: string
}

type PossibleErrors = FatherNotFound | MotherNotFound | ProjectActionBlocked

type Response = {
  affiliation: Affiliation
}

@Injectable()
export class CreateAffiliationService
  implements Service<Request, PossibleErrors, Response>
{
  constructor(
    private readonly personsRepository: PersonsRepository,
    private readonly affiliationsRepository: AffiliationsRepository,
  ) {}

  async execute({
    fatherId,
    motherId,
  }: Request): Promise<Either<PossibleErrors, Response>> {
    if (!fatherId && !motherId) {
      return left(new ProjectActionBlocked())
    }

    if (fatherId) {
      const person = await this.personsRepository.findById(fatherId)

      if (!person) {
        return left(new FatherNotFound())
      }
    }

    if (motherId) {
      const person = await this.personsRepository.findById(motherId)

      if (!person) {
        return left(new MotherNotFound())
      }
    }

    const affiliation = Affiliation.create({
      fatherId: fatherId ? UniqueId.create(fatherId) : null,
      motherId: motherId ? UniqueId.create(motherId) : null,
    })

    await this.affiliationsRepository.create(affiliation)

    return right({ affiliation })
  }
}
