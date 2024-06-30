import { Controller } from '@shared/core/contracts/Controller'
import { PresenterProps } from '@shared/core/contracts/Presenter'
import { Controller as ControllerNest, Delete, HttpCode } from '@nestjs/common'
import { GetUserService } from '../services/GetUser.service'
import { StatusCode } from '@shared/core/types/StatusCode'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'
import { EmptyPresenter } from '@infra/presenters/Empty.presente'

@ControllerNest('/auth')
export class DeleteUserSessionsController
  implements Controller<PresenterProps>
{
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly getUserService: GetUserService,
    private readonly emptyPresenter: EmptyPresenter,
  ) {}

  @Delete()
  @HttpCode(StatusCode.NO_CONTENT)
  async handle(
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.getUserService.execute({
      id: sub,
    })

    if (response.isLeft()) {
      const error = response.value
      return this.errorPresenter.present(error)
    }

    return this.emptyPresenter.present()
  }
}
