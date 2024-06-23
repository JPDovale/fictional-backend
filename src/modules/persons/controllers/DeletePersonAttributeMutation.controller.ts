import { Controller } from '@shared/core/contracts/Controller'
import { PresenterProps } from '@shared/core/contracts/Presenter'
import {
  Controller as ControllerNest,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import {
  DeletePersonAttributeMutationGateway,
  DeletePersonAttributeMutationParams,
} from '../gateways/DeletePersonAttributeMutation.gateway'
import { DeletePersonAttributeMutationService } from '../services/DeletePersonAttributeMutation.service'
import { EmptyPresenter } from '@infra/presenters/Empty.presente'
import { StatusCode } from '@shared/core/types/StatusCode'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'

@ControllerNest(
  '/projects/:projectId/persons/:personId/attributes/:attributeId/mutations/:mutationId',
)
export class DeletePersonAttributeMutationController
  implements Controller<PresenterProps>
{
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly deletePersonAttributeMutationService: DeletePersonAttributeMutationService,
    private readonly emptyPresenter: EmptyPresenter,
  ) {}

  @Delete()
  @HttpCode(StatusCode.NO_CONTENT)
  async handle(
    @Param(DeletePersonAttributeMutationGateway)
    params: DeletePersonAttributeMutationParams,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.deletePersonAttributeMutationService.execute({
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
