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
  DeletePersonAttributeGateway,
  DeletePersonAttributeParams,
} from '../gateways/DeletePersonAttribute.gateway'
import { DeletePersonAttributeService } from '../services/DeletePersonAttribute.service'
import { EmptyPresenter } from '@infra/presenters/Empty.presente'
import { StatusCode } from '@shared/core/types/StatusCode'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'

@ControllerNest(
  '/projects/:projectId/persons/:personId/attributes/:attributeId',
)
export class DeletePersonAttributeController
  implements Controller<PresenterProps>
{
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly deletePersonAttributeService: DeletePersonAttributeService,
    private readonly emptyPresenter: EmptyPresenter,
  ) {}

  @Delete()
  @HttpCode(StatusCode.NO_CONTENT)
  async handle(
    @Param(DeletePersonAttributeGateway) params: DeletePersonAttributeParams,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.deletePersonAttributeService.execute({
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
