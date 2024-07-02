import { Service } from '@shared/core/contracts/Service'
import { Either, left, right } from '@shared/core/errors/Either'
import { Injectable } from '@nestjs/common'
import { TimelinesRepository } from '../repositories/Timelines.repository'
import { UsersRepository } from '@modules/users/repositories/Users.repository'
import { ProjectsRepository } from '@modules/projects/repositories/Projects.repository'
import { UserNotFound } from '@modules/users/errors/UserNotFound.error'
import { ProjectNotFound } from '@modules/projects/errors/ProjectNotFound.error'
import { TimelineNotFound } from '../errors/TimelineNotFound.error'
import { ProjectActionBlocked } from '@modules/projects/errors/ProjectActionBlocked.error'
import { BuildBlock } from '@modules/projects/valueObjects/BuildBlocks'
import { Event, ImportanceLevel } from '../entities/Event'
import { EventDate } from '../valueObjects/EventDate'
import { EventsRepository } from '../repositories/Events.repository'

type Request = {
  userId: string
  projectId: string
  timelineId: string
  title: string
  event: string
  importanceLevel: number
  date: string
}

type PossibleErros =
  | UserNotFound
  | ProjectNotFound
  | TimelineNotFound
  | ProjectActionBlocked

type Response = {
  event: Event
}

@Injectable()
export class CreateEventService
  implements Service<Request, PossibleErros, Response>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly projectsRepository: ProjectsRepository,
    private readonly timelinesRepository: TimelinesRepository,
    private readonly eventsRepository: EventsRepository,
  ) {}

  async execute({
    title,
    userId,
    projectId,
    timelineId,
    date,
    event: eventDescription,
    importanceLevel,
  }: Request): Promise<Either<PossibleErros, Response>> {
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      return left(new UserNotFound())
    }

    const project = await this.projectsRepository.findById(projectId)
    if (!project) {
      return left(new ProjectNotFound())
    }

    if (!project.userId.equals(user.id)) {
      return left(new ProjectActionBlocked())
    }

    if (!project.buildBlocks.implements(BuildBlock.TIME_LINES)) {
      return left(new ProjectActionBlocked())
    }

    const timeline = await this.timelinesRepository.findById(timelineId)
    if (!timeline) {
      return left(new TimelineNotFound())
    }

    const event = Event.create({
      title,
      event: eventDescription,
      importanceLevel: importanceLevel as ImportanceLevel,
      date: EventDate.createFromString(date),
      timelineId: timeline.id,
    })

    await this.eventsRepository.create(event)

    return right({ event })
  }
}
