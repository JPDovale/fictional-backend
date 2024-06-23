import { Controller } from '@shared/core/contracts/Controller'
import { PresenterProps } from '@shared/core/contracts/Presenter'
import { Controller as ControllerNest, Get, HttpCode } from '@nestjs/common'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import { GetProjectsService } from '../services/GetProjects.service'
import { ProjectPresenter } from '../presenters/Project.presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'

@ControllerNest('/projects')
export class GetProjectsController implements Controller<PresenterProps> {
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly getProjectsService: GetProjectsService,
    private readonly projectPresenter: ProjectPresenter,
  ) {}

  @Get()
  @HttpCode(StatusCode.OK)
  async handle(
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.getProjectsService.execute({
      userId: sub,
    })

    if (response.isLeft()) {
      const error = response.value
      return this.errorPresenter.present(error)
    }

    const { projects } = response.value

    return this.projectPresenter.presentMany(projects)
  }
}
