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
import { CreatePersonAttributeService } from '../services/CreatePersonAttribute.service'
import {
  CreatePersonAttributeBody,
  CreatePersonAttributeBodyGateway,
  CreatePersonAttributeParams,
  CreatePersonAttributeParamsGateway,
} from '../gateways/CreatePersonAttribute.gateway'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'

@ControllerNest('/projects/:projectId/persons/:personId/attributes')
export class CreatePersonAttributeController
  implements Controller<PresenterProps>
{
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly createPersonAttributeService: CreatePersonAttributeService,
  ) {}

  @Post()
  @HttpCode(StatusCode.CREATED)
  async handle(
    @Param(CreatePersonAttributeParamsGateway)
    params: CreatePersonAttributeParams,
    @Body(CreatePersonAttributeBodyGateway) body: CreatePersonAttributeBody,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.createPersonAttributeService.execute({
      ...body,
      ...params,
      userId: sub,
    })

    if (response.isLeft()) {
      const error = response.value
      return this.errorPresenter.present(error)
    }

    return {
      status: StatusCode.CREATED,
    }
  }
}
