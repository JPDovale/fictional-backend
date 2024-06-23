import { Controller } from '@shared/core/contracts/Controller'
import { PresenterProps } from '@shared/core/contracts/Presenter'
import {
  Controller as ControllerNest,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import {
  DeleteProjectGateway,
  DeleteProjectParams,
} from '../gateways/DeleteProject.gateway'
import { DeleteProjectService } from '../services/DeleteProject.service'
import { EmptyPresenter } from '@infra/presenters/Empty.presente'
import { StatusCode } from '@shared/core/types/StatusCode'
import { CurrentLoggedUserDecorator } from '@providers/auth/decorators/CurrentLoggedUser.decorator'
import { TokenPayloadSchema } from '@providers/auth/strategys/JwtStrategy'

@ControllerNest('/projects/:projectId')
export class DeleteProjectController implements Controller<PresenterProps> {
  constructor(
    private readonly errorPresenter: ErrorPresenter,
    private readonly deleteProjectService: DeleteProjectService,
    private readonly emptyPresenter: EmptyPresenter,
  ) {}

  @Delete()
  @HttpCode(StatusCode.NO_CONTENT)
  async handle(
    @Param(DeleteProjectGateway) params: DeleteProjectParams,
    @CurrentLoggedUserDecorator() { sub }: TokenPayloadSchema,
  ): Promise<PresenterProps> {
    const response = await this.deleteProjectService.execute({
      ...params,
      userId: sub,
    })

    if (response.isLeft()) {
      const error = response.value
      return this.errorPresenter.present(error)
    }

    return this.emptyPresenter.present()
  }
}
