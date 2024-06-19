// import { Controller, Request } from '@shared/core/contracts/Controller'
// import { PresenterProps } from '@shared/core/contracts/Presenter'
// import { Injectable } from '@nestjs/common'
// import { ErrorPresenter } from '@infra/presenters/Error.presenter'
// import { EmptyPresenter } from '@infra/requester/presenters/Empty.presenter'
// import { UpdatePersonAttributeMutationGateway } from '../gateways/UpdatePersonAttributeMutation.gateway'
// import { UpdatePersonAttributeMutationService } from '../services/UpdatePersonAttributeMutation.service'

// @Injectable()
// export class UpdatePersonAttributeMutationController
//   implements Controller<PresenterProps>
// {
//   constructor(
//     private readonly updatePersonAttributeMutationGateway: UpdatePersonAttributeMutationGateway,
//     private readonly errorPresenter: ErrorPresenter,
//     private readonly updatePersonAttributeMutationService: UpdatePersonAttributeMutationService,
//     private readonly emptyPresenter: EmptyPresenter,
//   ) {}

//   async handle({ _data }: Request): Promise<PresenterProps> {
//     const body = this.updatePersonAttributeMutationGateway.transform(_data)

//     const response =
//       await this.updatePersonAttributeMutationService.execute(body)

//     if (response.isLeft()) {
//       const error = response.value
//       return this.errorPresenter.present(error)
//     }

//     return this.emptyPresenter.present()
//   }
// }
