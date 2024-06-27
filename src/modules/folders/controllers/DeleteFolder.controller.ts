import { Controller } from '@shared/core/contracts/Controller'
import {
  Controller as ControllerNest,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { PresenterProps } from '@shared/core/contracts/Presenter'
import { StatusCode } from '@shared/core/types/StatusCode'

import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import { EmptyPresenter } from '@infra/presenters/Empty.presente'
import { DeleteFoldersService } from '../services/DeleteFolders.service'
import {
  DeleteFolderParams,
  DeleteFolderParamsGateway,
} from '../gateways/DeleteFolder.gateway'

@ControllerNest('/projects/:projectId/folders/:folderId')
export class DeleteFolderController implements Controller<PresenterProps> {
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly deleteFolderService: DeleteFoldersService,
    private readonly empytPresenter: EmptyPresenter,
  ) {}

  @Delete()
  @HttpCode(StatusCode.NO_CONTENT)
  async handle(
    @Param(DeleteFolderParamsGateway) params: DeleteFolderParams,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.deleteFolderService.execute({
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
