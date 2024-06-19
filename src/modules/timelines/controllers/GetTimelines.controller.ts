// import { Controller, Request } from '@shared/core/contracts/Controller'
// import { PresenterProps } from '@shared/core/contracts/Presenter'
// import { Injectable } from '@nestjs/common'
// import { ErrorPresenter } from '@infra/presenters/Error.presenter'
// import { GetTimelinesGateway } from '../gateways/GetTimelines.gateways'
// import { GetTimelinesService } from '../services/GetTimelines.service'
// import { TimelinePresenter } from '../presenters/Timeline.presenter'

// @Injectable()
// export class GetTimelinesController implements Controller<PresenterProps> {
//   constructor(
//     private readonly getTimelinesGateway: GetTimelinesGateway,
//     private readonly errorPresenter: ErrorPresenter,
//     private readonly getTimelinesService: GetTimelinesService,
//     private readonly timelinePresenter: TimelinePresenter,
//   ) {}

//   async handle({ _data }: Request): Promise<PresenterProps> {
//     const body = this.getTimelinesGateway.transform(_data)

//     const response = await this.getTimelinesService.execute(body)

//     if (response.isLeft()) {
//       const error = response.value
//       return this.errorPresenter.present(error)
//     }

//     const { timelines } = response.value

//     return this.timelinePresenter.presentMany(timelines)
//   }
// }
