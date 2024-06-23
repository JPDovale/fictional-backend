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
import { UpdatePersonAttributeMutationService } from '../services/UpdatePersonAttributeMutation.service'
import { StatusCode } from '@shared/core/types/StatusCode'
import { EmptyPresenter } from '@infra/presenters/Empty.presente'
import {
  UpdatePersonAttributeMutationParamsGateway,
  UpdatePersonAttributeMutationBody,
  UpdatePersonAttributeMutationParams,
  UpdatePersonAttributeMutationBodyGateway,
} from '../gateways/UpdatePersonAttributeMutation.gateway'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'

@ControllerNest(
  '/projects/:projectId/persons/:personId/attributes/:attributeId/mutations/:mutationId',
)
export class UpdatePersonAttributeMutationController
  implements Controller<PresenterProps>
{
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly updatePersonAttributeMutationService: UpdatePersonAttributeMutationService,
    private readonly emptyPresenter: EmptyPresenter,
  ) {}

  @Put()
  @HttpCode(StatusCode.NO_CONTENT)
  async handle(
    @Param(UpdatePersonAttributeMutationParamsGateway)
    params: UpdatePersonAttributeMutationParams,
    @Body(UpdatePersonAttributeMutationBodyGateway)
    body: UpdatePersonAttributeMutationBody,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.updatePersonAttributeMutationService.execute({
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
