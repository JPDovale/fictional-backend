// import { Controller } from '@shared/core/contracts/Controller'
// import { PresenterProps } from '@shared/core/contracts/Presenter'
// import { Injectable } from '@nestjs/common'
// import { ErrorPresenter } from '@infra/presenters/Error.presenter'
// import { GetFirstUserService } from '../services/GetFirstUser.service'
// import { UserPresenter } from '../presenters/User.presenter'

// @Injectable()
// export class GetFirstUserController implements Controller<PresenterProps> {
//   constructor(
//     private readonly errorPresenter: ErrorPresenter,
//     private readonly getFirstUserService: GetFirstUserService,
//     private readonly userPresenter: UserPresenter,
//   ) {}

//   async handle(): Promise<PresenterProps> {
//     const response = await this.getFirstUserService.execute()

//     if (response.isLeft()) {
//       const error = response.value
//       return this.errorPresenter.present(error)
//     }

//     const { user } = response.value

//     return this.userPresenter.present(user)
//   }
// }
