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
  GetTimelinesGateway,
  GetTimelinesParams,
} from '../gateways/GetTimelines.gateways'
import { GetTimelinesService } from '../services/GetTimelines.service'
import { TimelinesPresenter } from '../presenters/Timelines.presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'

@ControllerNest('/projects/:projectId/timelines')
export class GetTimelinesController implements Controller<PresenterProps> {
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly getTimelinesService: GetTimelinesService,
    private readonly timelinesPresenter: TimelinesPresenter,
  ) {}

  @Get()
  @HttpCode(StatusCode.OK)
  async handle(
    @Param(GetTimelinesGateway) params: GetTimelinesParams,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.getTimelinesService.execute({
      ...params,
      userId: sub,
    })

    if (response.isLeft()) {
      const error = response.value
      return this.errorPresenter.present(error)
    }

    const { timelines } = response.value

    return this.timelinesPresenter.presentMany(timelines)
  }
}
