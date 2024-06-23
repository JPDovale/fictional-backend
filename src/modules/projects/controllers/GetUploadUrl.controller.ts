import { Controller } from '@shared/core/contracts/Controller'
import {
  Body,
  Controller as ControllerNest,
  HttpCode,
  Post,
} from '@nestjs/common'
import { PresenterProps } from '@shared/core/contracts/Presenter'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import { GetUploadUrlService } from '../services/GetUploadUrl.service'
import { StatusCode } from '@shared/core/types/StatusCode'
import {
  GetUploadUrlBody,
  GetUploadUrlGateway,
} from '../gateways/GetUploadUrl.gateway'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'

@ControllerNest('/projects/upload')
export class GetUploadUrlController implements Controller<PresenterProps> {
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly getUloadUrlService: GetUploadUrlService,
  ) {}

  @Post()
  @HttpCode(StatusCode.CREATED)
  async handle(
    @Body(GetUploadUrlGateway) body: GetUploadUrlBody,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.getUloadUrlService.execute({
      ...body,
      userId: sub,
    })

    if (response.isLeft()) {
      const error = response.value
      return this.errorPresenter.present(error)
    }

    const { uploadUrl, name } = response.value

    return {
      status: StatusCode.CREATED,
      data: {
        uploadUrl,
        name,
      },
    }
  }
}
