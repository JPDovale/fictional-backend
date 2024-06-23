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
  GetPersonGateway,
  GetPersonParams,
} from '../gateways/GetPerson.gateway'
import { GetPersonService } from '../services/GetPerson.service'
import { PersonWithDetailsPresenter } from '../presenters/PersonWithDetails.presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'

@ControllerNest('/projects/:projectId/persons/:personId')
export class GetPersonController implements Controller<PresenterProps> {
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly getPersonService: GetPersonService,
    private readonly personWithDetaisPresenter: PersonWithDetailsPresenter,
  ) {}

  @Get()
  @HttpCode(StatusCode.OK)
  async handle(
    @Param(GetPersonGateway) params: GetPersonParams,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.getPersonService.execute({
      ...params,
      userId: sub,
    })

    if (response.isLeft()) {
      const error = response.value
      return this.errorPresenter.present(error)
    }

    const { person } = response.value

    return this.personWithDetaisPresenter.present(person)
  }
}
