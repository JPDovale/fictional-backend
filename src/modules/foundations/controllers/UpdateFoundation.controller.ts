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
import { UpdateFoundationService } from '../services/UpdateFoundation.service'
import { FoundationPresenter } from '../presenters/Foundation.presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import {
  UpdateFoundationBody,
  UpdateFoundationBodyGateway,
  UpdateFoundationParams,
  UpdateFoundationParamsGateway,
} from '../gateways/UpdateFoundation.gateway'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'
import { HTMLValidations } from '@providers/text/contracts/HMTLValidations'

@ControllerNest('/projects/:projectId/foundations/:foundationId')
export class UpdateFoundationController implements Controller<PresenterProps> {
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly updateFoundationService: UpdateFoundationService,
    private readonly foundationPresenter: FoundationPresenter,
    private readonly htmlValidations: HTMLValidations,
  ) {}

  @Put()
  @HttpCode(StatusCode.OK)
  async handle(
    @Param(UpdateFoundationParamsGateway) params: UpdateFoundationParams,
    @Body(UpdateFoundationBodyGateway) body: UpdateFoundationBody,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.updateFoundationService.execute({
      ...params,
      foundation: this.htmlValidations.sanitize(body.foundation),
      whoHappens: this.htmlValidations.sanitize(body.whoHappens),
      whatHappens: this.htmlValidations.sanitize(body.whatHappens),
      whyHappens: this.htmlValidations.sanitize(body.whyHappens),
      whereHappens: this.htmlValidations.sanitize(body.whereHappens),
      userId: sub,
    })

    if (response.isLeft()) {
      const error = response.value
      return this.errorPresenter.present(error)
    }

    const { foundation } = response.value

    return this.foundationPresenter.present(foundation)
  }
}
