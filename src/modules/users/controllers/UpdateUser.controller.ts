import { Controller } from '@shared/core/contracts/Controller'
import {
  Body,
  Controller as ControllerNest,
  HttpCode,
  Put,
} from '@nestjs/common'
import { PresenterProps } from '@shared/core/contracts/Presenter'
import { UpdateUserService } from '../services/UpdateUser.service'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import {
  UpdateUserBody,
  UpdateUserGateway,
} from '../gateways/UpdateUser.gateway'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'
import { EmptyPresenter } from '@infra/presenters/Empty.presente'

@ControllerNest('/users')
export class UpdateUserController implements Controller<PresenterProps> {
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly updateUserService: UpdateUserService,
    private readonly emptyPresenter: EmptyPresenter,
  ) {}

  @Put()
  @HttpCode(StatusCode.NO_CONTENT)
  async handle(
    @Body(UpdateUserGateway) body: UpdateUserBody,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.updateUserService.execute({
      ...body,
      userId: sub,
    })

    if (response.isLeft()) {
      const error = response.value
      return this.errorPresenter.present(error)
    }

    return this.emptyPresenter.present()
  }
}
