import { Person } from '@modules/persons/entities/Person'
import {
  Person as PersonFile,
  Event as EventFile,
  Prisma,
  PersonEventType,
} from '@prisma/client'
import { PersonType } from '@modules/persons/entities/types'
import { PersonWithDetails } from '@modules/persons/valuesObjects/PersonWithDetails'
import { PersonWithParents } from '@modules/persons/valuesObjects/PersonWithParents'
import { RepositoryMapper } from '@shared/core/contracts/Repository'
import { UniqueId } from '@shared/core/valueObjects/UniqueId'
import { Injectable } from '@nestjs/common'
import { EventsPrismaMapper } from '../timelines/EventsPrisma.mapper'

type PersonWithParentsType = PersonFile & {
  affiliation: {
    fatherId: string | null
    motherId: string | null
  } | null
}

type PersonWithDetailsType = PersonWithParentsType & {
  events: {
    type: PersonEventType
    event: EventFile
  }[]
}

@Injectable()
export class PersonsPrismaMapper extends RepositoryMapper<
  Person,
  PersonFile,
  Prisma.PersonUncheckedCreateInput
> {
  constructor(private readonly eventsMapper: EventsPrismaMapper) {
    super()
  }

  toDomain(raw: PersonFile): Person {
    return Person.create(
      {
        name: raw.name,
        type: raw.type as PersonType,
        projectId: UniqueId.create(raw.projectId),
        affiliationId: raw.affiliationId
          ? UniqueId.create(raw.affiliationId)
          : null,
        image: raw.imageUrl,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        trashedAt: raw.deletedAt,
        history: raw.history,
      },
      UniqueId.create(raw.id),
    )
  }

  toPersistence(entity: Person): Prisma.PersonUncheckedCreateInput {
    return {
      id: entity.id.toString(),
      type: entity.type,
      imageUrl: entity.image,
      name: entity.name,
      projectId: entity.projectId.toString(),
      affiliationId: entity.affiliationId?.toString() ?? null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.trashedAt,
      history: entity.history,
    }
  }

  toDomainWithParrents(raw: PersonWithParentsType): PersonWithParents {
    return PersonWithParents.create({
      type: raw.type as PersonType,
      name: raw.name,
      image: raw.imageUrl,
      projectId: UniqueId.create(raw.projectId),
      fatherId: raw.affiliation?.fatherId
        ? UniqueId.create(raw.affiliation.fatherId)
        : null,
      motherId: raw.affiliation?.motherId
        ? UniqueId.create(raw.affiliation.motherId)
        : null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      trashedAt: raw.deletedAt,
      personId: UniqueId.create(raw.id),
      history: raw.history,
    })
  }

  toDomainWithDetails(raw: PersonWithDetailsType): PersonWithDetails {
    const birthEvent = raw.events?.find((event) => event.type === 'BIRTH')
    const deathEvent = raw.events?.find((event) => event.type === 'DEATH')

    return PersonWithDetails.create({
      type: raw.type as PersonType,
      name: raw.name,
      image: raw.imageUrl,
      projectId: UniqueId.create(raw.projectId),
      fatherId: raw.affiliation?.fatherId
        ? UniqueId.create(raw.affiliation.fatherId)
        : null,
      motherId: raw.affiliation?.motherId
        ? UniqueId.create(raw.affiliation.motherId)
        : null,
      birthEvent: birthEvent?.event
        ? this.eventsMapper.toDomain(birthEvent.event)
        : null,
      deathEvent: deathEvent?.event
        ? this.eventsMapper.toDomain(deathEvent.event)
        : null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      trashedAt: raw.deletedAt,
      personId: UniqueId.create(raw.id),
      history: raw.history,
    })
  }
}
