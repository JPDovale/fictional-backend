import { Controller } from '@shared/core/contracts/Controller'
import { PresenterProps } from '@shared/core/contracts/Presenter'
import {
  Controller as ControllerNest,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import {
  GetAttributesPreviewGateway,
  GetAttributesPreviewParams,
} from '../gateways/GetAttributesPreview.gateway'
import { GetAttributesPreviewService } from '../services/GetAttributesPreview.service'
import { AttributePreviewPresenter } from '../presenters/AttributesPreview.presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'

@ControllerNest('/projects/:projectId/persons-attributes')
export class GetAttributesPreviewController
  implements Controller<PresenterProps>
{
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly getAttributesPreviewService: GetAttributesPreviewService,
    private readonly attributePreviewPresenter: AttributePreviewPresenter,
  ) {}

  @Get()
  @HttpCode(StatusCode.OK)
  async handle(
    @Param(GetAttributesPreviewGateway) params: GetAttributesPreviewParams,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.getAttributesPreviewService.execute({
      ...params,
      userId: sub,
    })

    if (response.isLeft()) {
      const error = response.value
      return this.errorPresenter.present(error)
    }

    const { attributes } = response.value

    return this.attributePreviewPresenter.presentMany(attributes)
  }
}
