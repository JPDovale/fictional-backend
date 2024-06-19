// import { Controller, Request } from '@shared/core/contracts/Controller'
// import { PresenterProps } from '@shared/core/contracts/Presenter'
// import { Injectable } from '@nestjs/common'
// import { ErrorPresenter } from '@infra/presenters/Error.presenter'
// import { EmptyPresenter } from '@infra/requester/presenters/Empty.presenter'
// import { ChangePositionPersonAttributeMutationGateway } from '../gateways/ChangePositionPersonAttributeMutation.gateway'
// import { ChangePositionPersonAttributeMutationService } from '../services/ChagePositionPersonAttributeMutation.service'

// @Injectable()
// export class ChangePositionPersonAttributeMutationController
//   implements Controller<PresenterProps>
// {
//   constructor(
//     private readonly changePositionPersonAttributeMutationGateway: ChangePositionPersonAttributeMutationGateway,
//     private readonly errorPresenter: ErrorPresenter,
//     private readonly changePositionPersonAttributeMutationService: ChangePositionPersonAttributeMutationService,
//     private readonly emptyPresenter: EmptyPresenter,
//   ) {}

//   async handle({ _data }: Request): Promise<PresenterProps> {
//     const body =
//       this.changePositionPersonAttributeMutationGateway.transform(_data)

//     const response =
//       await this.changePositionPersonAttributeMutationService.execute(body)

//     if (response.isLeft()) {
//       const error = response.value
//       return this.errorPresenter.present(error)
//     }

//     return this.emptyPresenter.present()
//   }
// }
