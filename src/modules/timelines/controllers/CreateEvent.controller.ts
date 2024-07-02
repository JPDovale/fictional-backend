import { Controller } from '@shared/core/contracts/Controller'
import { PresenterProps } from '@shared/core/contracts/Presenter'
import {
  Body,
  Controller as ControllerNest,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'
import { CreateEventService } from '../services/CreateEvent.service'
import { EmptyPresenter } from '@infra/presenters/Empty.presente'
import {
  CreateEventBody,
  CreateEventBodyGateway,
  CreateEventParams,
  CreateEventParamsGateway,
} from '../gateways/CreateEvent.gateways'
import { HTMLValidations } from '@providers/text/contracts/HMTLValidations'

@ControllerNest('/projects/:projectId/timelines/:timelineId/events')
export class CreateEventController implements Controller<PresenterProps> {
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly createEventService: CreateEventService,
    private readonly htmlValidations: HTMLValidations,
    private readonly emptyPresenter: EmptyPresenter,
  ) {}

  @Post()
  @HttpCode(StatusCode.CREATED)
  async handle(
    @Param(CreateEventParamsGateway) params: CreateEventParams,
    @Body(CreateEventBodyGateway) body: CreateEventBody,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.createEventService.execute({
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
