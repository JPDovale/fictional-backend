import { Controller } from '@shared/core/contracts/Controller'
import {
  Body,
  Controller as ControllerNest,
  HttpCode,
  Post,
} from '@nestjs/common'
import { PresenterProps } from '@shared/core/contracts/Presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { Public } from '@providers/auth/decorators/Public.decorator'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import { Response } from 'express'
import { LoginUserService } from '../services/LoginUser.service'
import { LoginUserBody, LoginUserGateway } from '../gateways/LoginUser.gateway'
import { LoginPresenter } from '../presenters/Login.presenter'

@ControllerNest('/auth')
export class LoginUserController
  implements Controller<PresenterProps | Response>
{
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly loginUserService: LoginUserService,
    private readonly loginPresenter: LoginPresenter,
  ) {}

  @Post()
  @Public()
  @HttpCode(StatusCode.CREATED)
  async handle(
    @Body(LoginUserGateway) body: LoginUserBody,
  ): Promise<PresenterProps | Response> {
    const response = await this.loginUserService.execute(body)

    if (response.isLeft()) {
      const error = response.value
      return this.errorPresenter.present(error)
    }

    const { accessToken, refreshToken } = response.value

    return this.loginPresenter.present(
      {
        refreshToken,
        accessToken,
      },
      StatusCode.CREATED,
    )
  }
}
