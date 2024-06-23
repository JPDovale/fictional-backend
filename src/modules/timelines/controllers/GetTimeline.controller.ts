import { Controller } from '@shared/core/contracts/Controller'
import { PresenterProps } from '@shared/core/contracts/Presenter'
import {
  Controller as ControllerNest,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import {
  GetTimelineGateway,
  GetTimelineParams,
} from '../gateways/GetTimeline.gateways'
import { GetTimelineService } from '../services/GetTimeline.service'
import { TimelineWithEventsPresenter } from '../presenters/TimelineWithEvents.presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'

@ControllerNest('/projects/:projectId/timelines/:timelineId')
export class GetTimelineController implements Controller<PresenterProps> {
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly getTimelineService: GetTimelineService,
    private readonly timelineWithEventsPresenter: TimelineWithEventsPresenter,
  ) {}

  @Get()
  @HttpCode(StatusCode.OK)
  async handle(
    @Param(GetTimelineGateway) params: GetTimelineParams,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.getTimelineService.execute({
      ...params,
      userId: sub,
    })

    if (response.isLeft()) {
      const error = response.value
      return this.errorPresenter.present(error)
    }

    const { timeline } = response.value

    return this.timelineWithEventsPresenter.present(timeline)
  }
}
