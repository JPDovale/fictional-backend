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
  GetProjectGateway,
  GetProjectParams,
} from '../gateways/GetProject.gateway'
import { GetProjectService } from '../services/GetProject.service'
import { ProjectPresenter } from '../presenters/Project.presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'

@ControllerNest('/projects/:projectId')
export class GetProjectController implements Controller<PresenterProps> {
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly getProjectService: GetProjectService,
    private readonly projectPresenter: ProjectPresenter,
  ) {}

  @Get()
  @HttpCode(StatusCode.OK)
  async handle(
    @Param(GetProjectGateway) { projectId }: GetProjectParams,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.getProjectService.execute({
      userId: sub,
      projectId,
    })

    if (response.isLeft()) {
      const error = response.value
      return this.errorPresenter.present(error)
    }

    const { project } = response.value

    return this.projectPresenter.present(project)
  }
}
