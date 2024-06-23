import { Controller } from '@shared/core/contracts/Controller'
import {
  Body,
  Controller as ControllerNest,
  HttpCode,
  Post,
} from '@nestjs/common'
import { PresenterProps } from '@shared/core/contracts/Presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { CreateProjectService } from '../services/CreateProject.service'
import { ProjectPresenter } from '../presenters/Project.presenter'
import {
  CreateProjectBody,
  CreateProjectGateway,
} from '../gateways/CreateProject.gateway'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'

@ControllerNest('/projects')
export class CreateProjectController implements Controller<PresenterProps> {
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly createProjectService: CreateProjectService,
    private readonly projectPresenter: ProjectPresenter,
  ) {}

  @Post()
  @HttpCode(StatusCode.CREATED)
  async handle(
    @Body(CreateProjectGateway) data: CreateProjectBody,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.createProjectService.execute({
      ...data,
      userId: sub,
    })

    if (response.isLeft()) {
      const error = response.value
      return this.errorPresenter.present(error)
    }

    const { project } = response.value

    return this.projectPresenter.present(project, StatusCode.CREATED)
  }
}
