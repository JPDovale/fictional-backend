import { Controller } from '@shared/core/contracts/Controller'
import { PresenterProps } from '@shared/core/contracts/Presenter'
import {
  Body,
  Controller as ControllerNest,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import { ChangePositionPersonAttributeMutationService } from '../services/ChagePositionPersonAttributeMutation.service'
import { EmptyPresenter } from '@infra/presenters/Empty.presente'
import { StatusCode } from '@shared/core/types/StatusCode'
import {
  ChangePositionPersonAttributeMutationParamsGateway,
  ChangePositionPersonAttributeMutationParams,
  ChangePositionPersonAttributeMutationBodyGateway,
  ChangePositionPersonAttributeMutationBody,
} from '../gateways/ChangePositionPersonAttributeMutation.gateway'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'

@ControllerNest(
  '/projects/:projectId/persons/:personId/attributes/:attributeId/mutations/:mutationId/position',
)
export class ChangePositionPersonAttributeMutationController
  implements Controller<PresenterProps>
{
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly changePositionPersonAttributeMutationService: ChangePositionPersonAttributeMutationService,
    private readonly emptyPresenter: EmptyPresenter,
  ) {}

  @Patch()
  @HttpCode(StatusCode.NO_CONTENT)
  async handle(
    @Param(ChangePositionPersonAttributeMutationParamsGateway)
    params: ChangePositionPersonAttributeMutationParams,
    @Body(ChangePositionPersonAttributeMutationBodyGateway)
    body: ChangePositionPersonAttributeMutationBody,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response =
      await this.changePositionPersonAttributeMutationService.execute({
        ...body,
        ...params,
        userId: sub,
      })

    if (response.isLeft()) {
      const error = response.value
      return this.errorPresenter.present(error)
    }

    return this.emptyPresenter.present()
  }
}
