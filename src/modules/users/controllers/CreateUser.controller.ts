import { Controller } from '@shared/core/contracts/Controller'
import {
  Body,
  Controller as ControllerNest,
  HttpCode,
  Post,
  Res,
} from '@nestjs/common'
import { PresenterProps } from '@shared/core/contracts/Presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import {
  CreateUserBody,
  CreateUserGateway,
} from '../gateways/CreateUser.gateway'
import { CreateUserService } from '../services/CreateUser.service'
import { Public } from '@providers/auth/decorators/Public.decorator'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import { Response } from 'express'

@ControllerNest('/users')
export class CreateUserController
  implements Controller<PresenterProps | Response>
{
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly createUserService: CreateUserService,
  ) {}

  @Post()
  @Public()
  @HttpCode(StatusCode.CREATED)
  async handle(
    @Body(CreateUserGateway) body: CreateUserBody,
    @Res() res: Response,
  ): Promise<PresenterProps | Response> {
    const response = await this.createUserService.execute(body)

    if (response.isLeft()) {
      const error = response.value
      return this.errorPresenter.present(error)
    }

    res.header('X-Location', '/users')
    return res.status(StatusCode.CREATED).end()
  }
}
