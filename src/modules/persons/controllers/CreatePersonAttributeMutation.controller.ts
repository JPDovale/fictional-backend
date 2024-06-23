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
import { CreatePersonAttributeMutationService } from '../services/CreatePersonAttributeMutation.service'
import {
  CreatePersonAttributeMutationBody,
  CreatePersonAttributeMutationBodyGateway,
  CreatePersonAttributeMutationParams,
  CreatePersonAttributeMutationParamsGateway,
} from '../gateways/CreatePersonAttributeMutation.gateway'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'

@ControllerNest(
  '/projects/:projectId/persons/:personId/attributes/:attributeId/mutations',
)
export class CreatePersonAttributeMutationController
  implements Controller<PresenterProps>
{
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly createPersonAttributeMutationService: CreatePersonAttributeMutationService,
  ) {}

  @Post()
  @HttpCode(StatusCode.CREATED)
  async handle(
    @Param(CreatePersonAttributeMutationParamsGateway)
    params: CreatePersonAttributeMutationParams,
    @Body(CreatePersonAttributeMutationBodyGateway)
    body: CreatePersonAttributeMutationBody,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.createPersonAttributeMutationService.execute({
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
