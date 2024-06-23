import { Controller } from '@shared/core/contracts/Controller'
import {
  Body,
  Controller as ControllerNest,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { PresenterProps } from '@shared/core/contracts/Presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { PersonPresenter } from '../presenters/Person.presenter'
import { UpdatePersonService } from '../services/UpdatePerson.service'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import {
  UpdatePersonBody,
  UpdatePersonBodyGateway,
  UpdatePersonParams,
  UpdatePersonParamsGateway,
} from '../gateways/UpdatePerson.gateway'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'
import { HTMLValidations } from '@providers/text/contracts/HMTLValidations'

@ControllerNest('/projects/:projectId/persons/:personId')
export class UpdatePersonController implements Controller<PresenterProps> {
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly updatePersonService: UpdatePersonService,
    private readonly personPresenter: PersonPresenter,
    private readonly htmlValidations: HTMLValidations,
  ) {}

  @Put()
  @HttpCode(StatusCode.OK)
  async handle(
    @Param(UpdatePersonParamsGateway) params: UpdatePersonParams,
    @Body(UpdatePersonBodyGateway) body: UpdatePersonBody,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.updatePersonService.execute({
      ...body,
      ...params,
      history: this.htmlValidations.sanitize(body.history),
      userId: sub,
    })

    if (response.isLeft()) {
      const error = response.value
      return this.errorPresenter.present(error)
    }

    const { person } = response.value

    return this.personPresenter.present(person, StatusCode.OK)
  }
}
