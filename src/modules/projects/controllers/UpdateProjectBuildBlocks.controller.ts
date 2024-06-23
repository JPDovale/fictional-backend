import { Controller } from '@shared/core/contracts/Controller'
import {
  Body,
  Controller as ControllerNest,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import { PresenterProps } from '@shared/core/contracts/Presenter'
import { ProjectPresenter } from '../presenters/Project.presenter'
import { UpdateProjectBuildBlocksService } from '../services/UpdateProjectBuildBlocks.service'
import { StatusCode } from '@shared/core/types/StatusCode'
import {
  UpdateProjectBuildBlocksBody,
  UpdateProjectBuildBlocksBodyGateway,
  UpdateProjectBuildBlocksParams,
  UpdateProjectBuildBlocksParamsGateway,
} from '../gateways/UpdateProjectBuildBlocks.gateway'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'

@ControllerNest('/projects/:projectId/build-blocks')
export class UpdateProjectBuildBlocksController
  implements Controller<PresenterProps>
{
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly updateProjectBuildBlocksService: UpdateProjectBuildBlocksService,
    private readonly projectPresenter: ProjectPresenter,
  ) {}

  @Patch()
  @HttpCode(StatusCode.OK)
  async handle(
    @Param(UpdateProjectBuildBlocksParamsGateway)
    params: UpdateProjectBuildBlocksParams,
    @Body(UpdateProjectBuildBlocksBodyGateway)
    body: UpdateProjectBuildBlocksBody,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.updateProjectBuildBlocksService.execute({
      ...body,
      ...params,
      userId: sub,
    })

    if (response.isLeft()) {
      const error = response.value
      return this.errorPresenter.present(error)
    }

    const { project } = response.value

    return this.projectPresenter.present(project)
  }
}
