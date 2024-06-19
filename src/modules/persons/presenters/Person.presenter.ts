import { Presenter, PresenterProps } from '@shared/core/contracts/Presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { makeImageLocation } from '@utils/makeImageLocation'
import { Person } from '../entities/Person'
import { PersonType } from '../entities/types'
import { Injectable } from '@nestjs/common'

export interface PersonResponse {
  id: string
  name: string
  image: {
    url: string | null
    alt: string
  }
  history: string | null
  affiliationId: string | null
  projectId: string
  type: PersonType
  createdAt: Date
  updatedAt: Date | null
}

export interface PersonPresented {
  person: PersonResponse
}

export interface PersonsPresented {
  persons: PersonResponse[]
}

@Injectable()
export class PersonPresenter
  implements Presenter<Person, PersonPresented, PersonsPresented>
{
  private parse(raw: Person): PersonResponse {
    return {
      id: raw.id.toString(),
      name: raw.name || '??????',
      image: {
        url: makeImageLocation(raw.image),
        alt: raw.name ?? '',
      },
      history: raw.history,
      type: raw.type,
      affiliationId: raw.affiliationId?.toString() ?? null,
      projectId: raw.projectId.toString(),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  }

  present(
    raw: Person,
    status: StatusCode = StatusCode.OK,
  ): PresenterProps<PersonPresented> {
    return {
      status,
      data: {
        person: this.parse(raw),
      },
    }
  }

  presentMany(
    raws: Person[],
    status: StatusCode = StatusCode.OK,
  ): PresenterProps<PersonsPresented> {
    return {
      status,
      data: {
        persons: raws.map(this.parse),
      },
    }
  }
}
