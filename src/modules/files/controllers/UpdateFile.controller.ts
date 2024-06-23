import {
  Body,
  Controller as ControllerNest,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { PresenterProps } from '@shared/core/contracts/Presenter'
import { Controller } from '@shared/core/contracts/Controller'
import { UpdateFileService } from '../services/UpdateFile.service'
import { FilePresenter } from '../presenters/File.presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import {
  UpdateFileBody,
  UpdateFileBodyGateway,
  UpdateFileParams,
  UpdateFileParamsGateway,
} from '../gateways/UpdateFile.gateway'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'
import { HTMLValidations } from '@providers/text/contracts/HMTLValidations'

@ControllerNest('/projects/:projectId/files/:fileId')
export class UpdateFileController implements Controller<PresenterProps> {
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly updateFileService: UpdateFileService,
    private readonly filePresenter: FilePresenter,
    private readonly htmlValidations: HTMLValidations,
  ) {}

  @Put()
  @HttpCode(StatusCode.OK)
  async handle(
    @Param(UpdateFileParamsGateway) params: UpdateFileParams,
    @Body(UpdateFileBodyGateway) body: UpdateFileBody,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.updateFileService.execute({
      ...body,
      ...params,
      content: this.htmlValidations.sanitize(body.content),
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
