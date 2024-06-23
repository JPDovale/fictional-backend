import { PresenterProps } from '@shared/core/contracts/Presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { Controller } from '@shared/core/contracts/Controller'
import { GetFileGateway, GetFileParams } from '../gateways/GetFile.gateway'
import { GetFileService } from '../services/GetFile.service'
import { FilePresenter } from '../presenters/File.presenter'
import {
  Controller as ControllerNest,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'

@ControllerNest('/projects/:projectId/files/:fileId')
export class GetFileController implements Controller<PresenterProps> {
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly getFileService: GetFileService,
    private readonly filePresenter: FilePresenter,
  ) {}

  @Get()
  @HttpCode(StatusCode.OK)
  async handle(
    @Param(GetFileGateway) params: GetFileParams,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.getFileService.execute({
      ...params,
      userId: sub,
    })

    if (response.isLeft()) {
      const error = response.value
      return this.errorPresenter.present(error)
    }

    const { file } = response.value

    return this.filePresenter.present(file, StatusCode.OK)
  }
}
