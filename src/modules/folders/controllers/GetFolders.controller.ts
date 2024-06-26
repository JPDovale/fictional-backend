import { Controller } from '@shared/core/contracts/Controller'
import {
  Controller as ControllerNest,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common'
import { PresenterProps } from '@shared/core/contracts/Presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import {
  CreateFolderParams,
  CreateFolderParamsGateway,
} from '../gateways/CreateFolder.gateway'
import { GetFoldersService } from '../services/GetFolders.service'
import { FolderWithChildsPresenter } from '../presenters/FolderWithChilds.presenter'

@ControllerNest('/projects/:projectId/folders')
export class GetFoldersController implements Controller<PresenterProps> {
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly getFolderService: GetFoldersService,
    private readonly folderWithChildsPresenter: FolderWithChildsPresenter,
  ) {}

  @Get()
  @HttpCode(StatusCode.OK)
  async handle(
    @Param(CreateFolderParamsGateway) params: CreateFolderParams,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.getFolderService.execute({
      ...params,
      userId: sub,
    })

    if (response.isLeft()) {
      const error = response.value
      return this.errorPresenter.present(error)
    }

    const { folders } = response.value

    return this.folderWithChildsPresenter.presentMany(folders)
  }
}
