import { Controller } from '@shared/core/contracts/Controller'
import { PresenterProps } from '@shared/core/contracts/Presenter'
import {
  Body,
  Controller as ControllerNest,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'
import { EmptyPresenter } from '@infra/presenters/Empty.presente'

import { HTMLValidations } from '@providers/text/contracts/HMTLValidations'
import {
  UpdateEventBody,
  UpdateEventBodyGateway,
  UpdateEventParams,
  UpdateEventParamsGateway,
} from '../gateways/UpdateEvent.gateways'
import { UpdateEventService } from '../services/UpdateEvent.service'

@ControllerNest('/projects/:projectId/timelines/:timelineId/events/:eventId')
export class UpdateEventController implements Controller<PresenterProps> {
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly updateEventService: UpdateEventService,
    private readonly htmlValidations: HTMLValidations,
    private readonly emptyPresenter: EmptyPresenter,
  ) {}

  @Put()
  @HttpCode(StatusCode.NO_CONTENT)
  async handle(
    @Param(UpdateEventParamsGateway) params: UpdateEventParams,
    @Body(UpdateEventBodyGateway) body: UpdateEventBody,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.updateEventService.execute({
      ...body,
      ...params,
      event: this.htmlValidations.sanitize(body.event) as string,
      userId: sub,
    })

    if (response.isLeft()) {
      const error = response.value
      return this.errorPresenter.present(error)
    }

    return this.emptyPresenter.present()
  }
}
