import { Service } from '@shared/core/contracts/Service'
import { Either, left, right } from '@shared/core/errors/Either'
import { Injectable } from '@nestjs/common'
import { TimelinesRepository } from '../repositories/Timelines.repository'
import { ProjectsRepository } from '@modules/projects/repositories/Projects.repository'
import { ProjectNotFound } from '@modules/projects/errors/ProjectNotFound.error'
import { TimelineNotFound } from '../errors/TimelineNotFound.error'
import { Event } from '../entities/Event'
import { EventDate } from '../valueObjects/EventDate'
import { EventsRepository } from '../repositories/Events.repository'
import { EventToPerson, EventToPersonType } from '../entities/EventToPerson'
import { Person } from '@modules/persons/entities/Person'
import { BuildBlock } from '@modules/projects/valueObjects/BuildBlocks'
import { ProjectActionBlocked } from '@modules/projects/errors/ProjectActionBlocked.error'
import { EventsToPersonRepository } from '../repositories/EventsToPerson.repository'
import { TransactorService } from '@infra/database/transactor/contracts/Transactor.service'

type EventReceived = {
  date: string
  event: string
  type: EventToPersonType
  title: string
}

type Request = {
  person: Person
  eventsReceived: EventReceived[]
}

type PossibleErros = ProjectNotFound | TimelineNotFound | ProjectActionBlocked

type Response = {
  events: Event[]
  eventsToPerson: EventToPerson[]
}

@Injectable()
export class CreateManyPersonEventsForDefaultTimelineService
  implements Service<Request, PossibleErros, Response>
{
  constructor(
    private readonly transactor: TransactorService,
    private readonly timelinesRepository: TimelinesRepository,
    private readonly projectsRepository: ProjectsRepository,
    private readonly eventsRepository: EventsRepository,
    private readonly eventsToPersonRepository: EventsToPersonRepository,
  ) {}

  async execute({
    eventsReceived,
    person,
  }: Request): Promise<Either<PossibleErros, Response>> {
    const project = await this.projectsRepository.findById(
      person.projectId.toString(),
    )
    if (!project) {
      return left(new ProjectNotFound())
    }

    if (!project.buildBlocks.implements(BuildBlock.TIME_LINES)) {
      return left(new ProjectActionBlocked())
    }

    const timeline = await this.timelinesRepository.findByProjectId(
      project.id.toString(),
    )
    if (!timeline) {
      return left(new TimelineNotFound())
    }

    const events: Event[] = []
    const eventsToPerson: EventToPerson[] = []

    eventsReceived.forEach((eventReceived) => {
      const date = EventDate.createFromString(eventReceived.date)

      const event = Event.create({
        date,
        title: eventReceived.title,
        timelineId: timeline.id,
        event: eventReceived.event,
        importanceLevel: Event.getImportanceLevelForPersonEvent(
          person.type,
          eventReceived.type,
        ),
      })

      events.push(event)

      const eventToPerson = EventToPerson.create({
        eventId: event.id,
        type: eventReceived.type,
        personId: person.id,
      })

      eventsToPerson.push(eventToPerson)
    })

    const transaction = this.transactor.start()

    transaction.add((ctx) => this.eventsRepository.createMany(events, ctx))
    transaction.add((ctx) =>
      this.eventsToPersonRepository.createMany(eventsToPerson, ctx),
    )

    await this.transactor.execute(transaction)

    return right({ events, eventsToPerson })
  }
}
