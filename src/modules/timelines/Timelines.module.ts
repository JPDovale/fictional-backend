import { DatabaseModule } from '@infra/database/Database.module'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import { Module } from '@nestjs/common'
import { TimelinesPresenter } from './presenters/Timelines.presenter'
import { GetTimelinesController } from './controllers/GetTimelines.controller'
import { GetTimelinesService } from './services/GetTimelines.service'
import { GetTimelineService } from './services/GetTimeline.service'
import { GetTimelineController } from './controllers/GetTimeline.controller'
import { TimelineWithEventsPresenter } from './presenters/TimelineWithEvents.presenter'
import { CreateEventController } from './controllers/CreateEvent.controller'
import { CreateEventService } from './services/CreateEvent.service'
import { EmptyPresenter } from '@infra/presenters/Empty.presente'
import { TextModule } from '@providers/text/Text.module'
import { UpdateEventController } from './controllers/UpdateEvent.controller'
import { UpdateEventService } from './services/UpdateEvent.service'
import { DeleteEventController } from './controllers/DeleteEvent.controller'
import { DeleteEventService } from './services/DeleteEvent.service'

@Module({
  imports: [DatabaseModule, TextModule],
  controllers: [
    GetTimelinesController,
    GetTimelineController,
    CreateEventController,
    UpdateEventController,
    DeleteEventController,
  ],
  providers: [
    GetTimelinesService,
    GetTimelineService,
    CreateEventService,
    UpdateEventService,
    DeleteEventService,
    ErrorPresenter,
    EmptyPresenter,
    TimelinesPresenter,
    TimelineWithEventsPresenter,
  ],
})
export class TimelinesModule {}
