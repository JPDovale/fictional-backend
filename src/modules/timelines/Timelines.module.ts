import { DatabaseModule } from '@infra/database/Database.module'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import { Module } from '@nestjs/common'
import { TimelinesPresenter } from './presenters/Timelines.presenter'
import { GetTimelinesController } from './controllers/GetTimelines.controller'
import { GetTimelinesService } from './services/GetTimelines.service'
import { GetTimelineService } from './services/GetTimeline.service'
import { GetTimelineController } from './controllers/GetTimeline.controller'
import { TimelineWithEventsPresenter } from './presenters/TimelineWithEvents.presenter'

@Module({
  imports: [DatabaseModule],
  controllers: [GetTimelinesController, GetTimelineController],
  providers: [
    GetTimelinesService,
    GetTimelineService,
    ErrorPresenter,
    TimelinesPresenter,
    TimelineWithEventsPresenter,
  ],
})
export class TimelinesModule {}
