import { Presenter, PresenterProps } from '@shared/core/contracts/Presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { Injectable } from '@nestjs/common'
import { Timeline } from '../entities/Timeline'

export interface TimelineResponse {
  id: string
  name: string
  projectId: string
  createdAt: Date
  updatedAt: Date | null
}

export interface TimelinePresented {
  timeline: TimelineResponse
}

export interface TimelinesPresented {
  timelines: TimelineResponse[]
}

@Injectable()
export class TimelinesPresenter
  implements Presenter<Timeline, TimelinePresented, TimelinesPresented>
{
  private parse(raw: Timeline): TimelineResponse {
    return {
      id: raw.id.toString(),
      name: raw.name || '??????',
      projectId: raw.projectId.toString(),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  }

  present(
    raw: Timeline,
    status: StatusCode = StatusCode.OK,
  ): PresenterProps<TimelinePresented> {
    return {
      status,
      data: {
        timeline: this.parse(raw),
      },
    }
  }

  presentMany(
    raws: Timeline[],
    status: StatusCode = StatusCode.OK,
  ): PresenterProps<TimelinesPresented> {
    return {
      status,
      data: {
        timelines: raws.map(this.parse),
      },
    }
  }
}
