import { Service } from '@shared/core/contracts/Service'
import { Either, left, right } from '@shared/core/errors/Either'
import { PersonsRepository } from '@modules/persons/repositories/Persons.repository'
import { ProjectActionBlocked } from '@modules/projects/errors/ProjectActionBlocked.error'
import { FatherNotFound } from '@modules/persons/errors/FatherNotFound.error'
import { MotherNotFound } from '@modules/persons/errors/MotherNotFound.error'
import { Affiliation } from '../entities/Affiliation'
import { AffiliationsRepository } from '../repositories/Affiliations.repository'
import { AffiliationNotFound } from '../errors/AffiliationNotFound.error'
import { Injectable } from '@nestjs/common'

type Request = {
  fatherId?: string
  motherId?: string
}

type PossibleErrors =
  | AffiliationNotFound
  | FatherNotFound
  | MotherNotFound
  | ProjectActionBlocked

type Response = {
  affiliation: Affiliation
}

@Injectable()
export class GetAffiliationByParentsIdService
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

    const affiliation =
      await this.affiliationsRepository.findByFatherAndMotherId({
        fatherId: fatherId || null,
        motherId: motherId || null,
      })

    if (!affiliation) {
      return left(new AffiliationNotFound())
    }

    return right({ affiliation })
  }
}
