// import { Controller, Request } from '@shared/core/contracts/Controller'
// import { PresenterProps } from '@shared/core/contracts/Presenter'
// import { Injectable } from '@nestjs/common'
// import { ErrorPresenter } from '@infra/presenters/Error.presenter'
// import { DeleteProjectGateway } from '../gateways/DeleteProject.gateway'
// import { EmptyPresenter } from '@infra/requester/presenters/Empty.presenter'
// import { DeleteProjectService } from '../services/DeleteProject.service'

// @Injectable()
// export class DeleteProjectController implements Controller<PresenterProps> {
//   constructor(
//     private readonly deleteProjectGateway: DeleteProjectGateway,
//     private readonly errorPresenter: ErrorPresenter,
//     private readonly deleteProjectService: DeleteProjectService,
//     private readonly emptyPresenter: EmptyPresenter,
//   ) {}

//   async handle({ _data }: Request): Promise<PresenterProps> {
//     const body = this.deleteProjectGateway.transform(_data)

//     const response = await this.deleteProjectService.execute(body)

//     if (response.isLeft()) {
//       const error = response.value
//       return this.errorPresenter.present(error)
//     }

//     return this.emptyPresenter.present()
//   }
// }
