// import { Controller, Request } from '@shared/core/contracts/Controller'
// import { PresenterProps } from '@shared/core/contracts/Presenter'
// import { Injectable } from '@nestjs/common'
// import { ErrorPresenter } from '@infra/presenters/Error.presenter'
// import { GetProjectsGateway } from '../gateways/GetProjects.gateway'
// import { GetProjectsService } from '../services/GetProjects.service'
// import { ProjectPresenter } from '../presenters/Project.presenter'

// @Injectable()
// export class GetProjectsController implements Controller<PresenterProps> {
//   constructor(
//     private readonly getProjectsGateway: GetProjectsGateway,
//     private readonly errorPresenter: ErrorPresenter,
//     private readonly getProjectsService: GetProjectsService,
//     private readonly projectPresenter: ProjectPresenter,
//   ) {}

//   async handle({ _data }: Request): Promise<PresenterProps> {
//     const body = this.getProjectsGateway.transform(_data)

//     const response = await this.getProjectsService.execute(body)

//     if (response.isLeft()) {
//       const error = response.value
//       return this.errorPresenter.present(error)
//     }

//     const { projects } = response.value

//     return this.projectPresenter.presentMany(projects)
//   }
// }
