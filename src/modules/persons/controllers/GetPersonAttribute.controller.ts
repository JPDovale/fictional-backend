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
  GetPersonAttributeGateway,
  GetPersonAttributeParams,
} from '../gateways/GetPersonAttribute.gateway'
import { GetPersonAttributeService } from '../services/GetPersonAttribute.service'
import { AttributePresenter } from '../presenters/Attribute.presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'

@ControllerNest(
  '/projects/:projectId/persons/:personId/attributes/:attributeId',
)
export class GetPersonAttributeController
  implements Controller<PresenterProps>
{
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly getPersonAttributeService: GetPersonAttributeService,
    private readonly attributePresenter: AttributePresenter,
  ) {}

  @Get()
  @HttpCode(StatusCode.OK)
  async handle(
    @Param(GetPersonAttributeGateway) params: GetPersonAttributeParams,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.getPersonAttributeService.execute({
      ...params,
      userId: sub,
    })

    if (response.isLeft()) {
      const error = response.value
      return this.errorPresenter.present(error)
    }

    const { attribute } = response.value

    return this.attributePresenter.present(attribute)
  }
}
