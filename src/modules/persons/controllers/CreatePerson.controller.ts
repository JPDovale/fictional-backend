import { Controller } from '@shared/core/contracts/Controller'
import {
  Body,
  Controller as ControllerNest,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common'
import { PresenterProps } from '@shared/core/contracts/Presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { CreatePersonService } from '../services/CreatePerson.service'
import { PersonPresenter } from '../presenters/Person.presenter'
import {
  CreatePersonBody,
  CreatePersonBodyGateway,
  CreatePersonParams,
  CreatePersonParamsGateway,
} from '../gateways/CreatePerson.gateway'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'

@ControllerNest('/projects/:projectId/persons')
export class CreatePersonController implements Controller<PresenterProps> {
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly createPersonService: CreatePersonService,
    private readonly personPresenter: PersonPresenter,
  ) {}

  @Post()
  @HttpCode(StatusCode.CREATED)
  async handle(
    @Body(CreatePersonBodyGateway) body: CreatePersonBody,
    @Param(CreatePersonParamsGateway) params: CreatePersonParams,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.createPersonService.execute({
      ...body,
      ...params,
      userId: sub,
    })

    if (response.isLeft()) {
      const error = response.value
      return this.errorPresenter.present(error)
    }

    const { person } = response.value

    return this.personPresenter.present(person, StatusCode.CREATED)
  }
}
