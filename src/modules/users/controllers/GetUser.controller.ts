import { Controller } from '@shared/core/contracts/Controller'
import { PresenterProps } from '@shared/core/contracts/Presenter'
import { Controller as ControllerNest, Get, HttpCode } from '@nestjs/common'
import { GetUserService } from '../services/GetUser.service'
import { UserPresenter } from '../presenters/User.presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'

@ControllerNest('/users')
export class GetUserController implements Controller<PresenterProps> {
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly getUserService: GetUserService,
    private readonly userPresenter: UserPresenter,
  ) {}

  @Get()
  @HttpCode(StatusCode.OK)
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

    const { user } = response.value

    return this.userPresenter.present(user)
  }
}
