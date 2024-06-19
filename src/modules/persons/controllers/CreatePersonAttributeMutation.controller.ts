// import { Controller, Request } from '@shared/core/contracts/Controller'
// import { PresenterProps } from '@shared/core/contracts/Presenter'
// import { Injectable } from '@nestjs/common'
// import { ErrorPresenter } from '@infra/presenters/Error.presenter'
// import { StatusCode } from '@shared/core/types/StatusCode'
// import { CreatePersonAttributeMutationGateway } from '../gateways/CreatePersonAttributeMutation.gateway'
// import { CreatePersonAttributeMutationService } from '../services/CreatePersonAttributeMutation.service'

// @Injectable()
// export class CreatePersonAttributeMutationController
//   implements Controller<PresenterProps>
// {
//   constructor(
//     private readonly createPersonAttributeMutationGateway: CreatePersonAttributeMutationGateway,
//     private readonly errorPresenter: ErrorPresenter,
//     private readonly createPersonAttributeMutationService: CreatePersonAttributeMutationService,
//   ) {}

//   async handle({ _data }: Request): Promise<PresenterProps> {
//     const body = this.createPersonAttributeMutationGateway.transform(_data)

//     const response =
//       await this.createPersonAttributeMutationService.execute(body)

//     if (response.isLeft()) {
//       const error = response.value
//       return this.errorPresenter.present(error)
//     }

//     return {
//       status: StatusCode.CREATED,
//     }
//   }
// }
