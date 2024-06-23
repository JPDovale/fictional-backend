import { Repository } from '@shared/core/contracts/Repository'
import { Affiliation } from '../entities/Affiliation'

export interface FindByFatherAndMotherIdProps {
  fatherId: string | null
  motherId: string | null
}

export abstract class AffiliationsRepository<T = unknown> extends Repository<
  Affiliation,
  T
> {
  abstract findByFatherAndMotherId(
    props: FindByFatherAndMotherIdProps,
    ctx?: T,
  ): Promise<Affiliation | null>

  abstract findByPersonId(personId: string, ctx?: T): Promise<Affiliation[]>
  abstract saveMany(affiliations: Affiliation[], ctx?: T): Promise<void>
}
