import { Presenter, PresenterProps } from '@shared/core/contracts/Presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { Affiliation } from '../entities/Affiliation'
import { Injectable } from '@nestjs/common'

export interface AffiliationResponse {
  id: string
  fatherId: string | null
  motherId: string | null
  createdAt: Date
  updatedAt: Date | null
}

export interface AffiliationPresented {
  affiliation: AffiliationResponse
}

export interface AffiliationsPresented {
  affiliations: AffiliationResponse[]
}

@Injectable()
export class AffiliationPresenter
  implements
    Presenter<Affiliation, AffiliationPresented, AffiliationsPresented>
{
  private parse(raw: Affiliation): AffiliationResponse {
    return {
      id: raw.id.toString(),
      fatherId: raw.fatherId ? raw.fatherId.toString() : null,
      motherId: raw.motherId ? raw.motherId.toString() : null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  }

  present(
    raw: Affiliation,
    status: StatusCode = StatusCode.OK,
  ): PresenterProps<AffiliationPresented> {
    return {
      status,
      data: {
        affiliation: this.parse(raw),
      },
    }
  }

  presentMany(
    raws: Affiliation[],
    status: StatusCode = StatusCode.OK,
  ): PresenterProps<AffiliationsPresented> {
    return {
      status,
      data: {
        affiliations: raws.map(this.parse),
      },
    }
  }
}
