import { EventHandler } from '@shared/core/events/EventHandler'
import { Injectable } from '@nestjs/common'
import { DomainEvents } from '@shared/core/events/DomainEvents'
import { PersonInfosUsedInEventUpdatedEvent } from '@modules/persons/events/PersonInfosUsedInEventsUpdated.event'
import { UpdateAllPersonEventsService } from '../services/UpdateAllPersonEvents.service'

@Injectable()
export class OnPersonInfosUsedInEventsUpdated implements EventHandler {
  constructor(
    private readonly updateAllPersonEventsService: UpdateAllPersonEventsService,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.updateAllEventsOfPerson.bind(this),
      PersonInfosUsedInEventUpdatedEvent.name,
    )
  }

  async updateAllEventsOfPerson({
    person,
  }: PersonInfosUsedInEventUpdatedEvent) {
    await this.updateAllPersonEventsService.execute({
      person,
    })
  }
}
