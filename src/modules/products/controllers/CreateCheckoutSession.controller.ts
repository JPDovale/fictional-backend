import { Controller } from '@shared/core/contracts/Controller'
import {
  Body,
  Controller as ControllerNest,
  HttpCode,
  Post,
} from '@nestjs/common'
import { PresenterProps } from '@shared/core/contracts/Presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import { CreateCheckoutSessionService } from '../services/CreateCheckoutSession.service'
import {
  CreateCheckoutSessionBody,
  CreateCheckoutSessionGateway,
} from '../gateways/CreateCheckoutSession.gateway'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'

@ControllerNest('/products/checkout')
export class CreateChekoutSessionController
  implements Controller<PresenterProps>
{
  constructor(
    private readonly createCheckoutSessionService: CreateCheckoutSessionService,
    private readonly errorPresenter: ErrorPresenter,
  ) {}

  @Post()
  @HttpCode(StatusCode.CREATED)
  async handle(
    @Body(CreateCheckoutSessionGateway) body: CreateCheckoutSessionBody,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.createCheckoutSessionService.execute({
      userId: sub,
      priceId: body.priceId,
    })

    if (response.isLeft()) {
      const error = response.value
      throw this.errorPresenter.present(error)
    }

    const { sessionId } = response.value

    return {
      status: StatusCode.CREATED,
      data: {
        sessionId,
      },
    }
  }
}
