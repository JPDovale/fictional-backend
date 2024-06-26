import { Controller } from '@shared/core/contracts/Controller'
import {
  Body,
  Controller as ControllerNest,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common'
import { PresenterProps } from '@shared/core/contracts/Presenter'
import { StatusCode } from '@shared/core/types/StatusCode'

import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import { EmptyPresenter } from '@infra/presenters/Empty.presente'
import { CreateFolderService } from '../services/CreateFolder.service'
import {
  CreateFolderBody,
  CreateFolderBodyGateway,
  CreateFolderParams,
  CreateFolderParamsGateway,
} from '../gateways/CreateFolder.gateway'

@ControllerNest('/projects/:projectId/folders')
export class CreateFolderController implements Controller<PresenterProps> {
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly createFolderService: CreateFolderService,
    private readonly empytPresenter: EmptyPresenter,
  ) {}

  @Post()
  @HttpCode(StatusCode.CREATED)
  async handle(
    @Body(CreateFolderBodyGateway) body: CreateFolderBody,
    @Param(CreateFolderParamsGateway) params: CreateFolderParams,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.createFolderService.execute({
      ...body,
      ...params,
      userId: sub,
    })

    if (response.isLeft()) {
      const error = response.value
      return this.errorPresenter.present(error)
    }

    return this.empytPresenter.present()
  }
}
