import {
  Body,
  Controller as ControllerNest,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common'
import { PresenterProps } from '@shared/core/contracts/Presenter'
import { Controller } from '@shared/core/contracts/Controller'
import { FilePresenter } from '../presenters/File.presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'
import { CreateFileService } from '../services/CreateFile.service'
import {
  CreateFileBody,
  CreateFileBodyGateway,
  CreateFileParams,
  CreateFileParamsGateway,
} from '../gateways/CreateFile.gateway'

@ControllerNest('/projects/:projectId/files')
export class CreateFileController implements Controller<PresenterProps> {
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly createFileService: CreateFileService,
    private readonly filePresenter: FilePresenter,
  ) {}

  @Post()
  @HttpCode(StatusCode.CREATED)
  async handle(
    @Param(CreateFileParamsGateway) params: CreateFileParams,
    @Body(CreateFileBodyGateway) body: CreateFileBody,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.createFileService.execute({
      ...body,
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
