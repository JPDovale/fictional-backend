import { Controller } from '@shared/core/contracts/Controller'
import {
  Body,
  Controller as ControllerNest,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { PresenterProps } from '@shared/core/contracts/Presenter'
import { StatusCode } from '@shared/core/types/StatusCode'

import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import { EmptyPresenter } from '@infra/presenters/Empty.presente'
import { UpdateFolderService } from '../services/UpdateFolder.service'
import {
  UpdateFolderBody,
  UpdateFolderBodyGateway,
  UpdateFolderParams,
  UpdateFolderParamsGateway,
} from '../gateways/UpdateFolder.gateway'

@ControllerNest('/projects/:projectId/folders/:folderId')
export class UpdateFolderController implements Controller<PresenterProps> {
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly UpdateFolderService: UpdateFolderService,
    private readonly empytPresenter: EmptyPresenter,
  ) {}

  @Put()
  @HttpCode(StatusCode.NO_CONTENT)
  async handle(
    @Body(UpdateFolderBodyGateway) body: UpdateFolderBody,
    @Param(UpdateFolderParamsGateway) params: UpdateFolderParams,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.UpdateFolderService.execute({
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
