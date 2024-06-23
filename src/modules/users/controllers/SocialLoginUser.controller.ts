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
import { LoginPresenter } from '../presenters/Login.presenter'
import {
  SocialLoginUserBody,
  SocialLoginUserGateway,
} from '../gateways/SocialLoginUser.gateway'
import { SocialLoginUserService } from '../services/SocialLoginUser.service'

@ControllerNest('/auth/social')
export class SocialLoginUserController
  implements Controller<PresenterProps | Response>
{
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly sicialLoginUserService: SocialLoginUserService,
    private readonly loginPresenter: LoginPresenter,
  ) {}

  @Post()
  @Public()
  @HttpCode(StatusCode.CREATED)
  async handle(
    @Body(SocialLoginUserGateway) body: SocialLoginUserBody,
  ): Promise<PresenterProps | Response> {
    const response = await this.sicialLoginUserService.execute(body)

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
