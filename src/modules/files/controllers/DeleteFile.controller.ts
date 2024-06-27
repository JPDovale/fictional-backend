import {
  Controller as ControllerNest,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { PresenterProps } from '@shared/core/contracts/Presenter'
import { Controller } from '@shared/core/contracts/Controller'
import { FilePresenter } from '../presenters/File.presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'
import { DeleteFileService } from '../services/DeleteFile.service'
import {
  DeleteFileParams,
  DeleteFileParamsGateway,
} from '../gateways/DeleteFile.gateway'

@ControllerNest('/projects/:projectId/files/:fileId')
export class DeleteFileController implements Controller<PresenterProps> {
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly deleteFileService: DeleteFileService,
    private readonly filePresenter: FilePresenter,
  ) {}

  @Delete()
  @HttpCode(StatusCode.NO_CONTENT)
  async handle(
    @Param(DeleteFileParamsGateway) params: DeleteFileParams,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.deleteFileService.execute({
      ...params,
      userId: sub,
    })

    if (response.isLeft()) {
      const error = response.value
      return this.errorPresenter.present(error)
    }

    const { file } = response.value

    return this.filePresenter.present(file, StatusCode.CREATED)
  }
}
