import { EventHandler } from '@shared/core/events/EventHandler'
import { Injectable } from '@nestjs/common'
import { DomainEvents } from '@shared/core/events/DomainEvents'
import { PersonBirthOrDeathDateUpdatedEvent } from '@modules/persons/events/PersonBirthOrDeathDateUpdated.event'
import { UpdateBirthAndDeathDateOfPersonInDefaultTimelineService } from '../services/UpdateBirthAndDeathDateOfPersonInDefaultTimeline.service'

@Injectable()
export class OnPersonBirthOrDeathDateUpdated implements EventHandler {
  constructor(
    private readonly updateBirthAndDeathDateOfPersonInDefaultTimelineService: UpdateBirthAndDeathDateOfPersonInDefaultTimelineService,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.updateAllEventsOfPerson.bind(this),
      PersonBirthOrDeathDateUpdatedEvent.name,
    )
  }

  async updateAllEventsOfPerson({
    person,
    birthDate,
    deathDate,
  }: PersonBirthOrDeathDateUpdatedEvent) {
    await this.updateBirthAndDeathDateOfPersonInDefaultTimelineService.execute({
      person,
      birthDate,
      deathDate,
    })
  }
}
