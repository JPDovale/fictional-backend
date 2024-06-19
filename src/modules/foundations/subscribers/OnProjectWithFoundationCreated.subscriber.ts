import { EventHandler } from '@shared/core/events/EventHandler'
import { DomainEvents } from '@shared/core/events/DomainEvents'
import { ProjectCreatedWithFoundationEvent } from '@modules/projects/events/ProjectCreatedWithFoundation.event'
import { CreateFoundationService } from '../services/CreateFoundation.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnProjectWithFoundationCreated implements EventHandler {
  constructor(
    private readonly createFoundationService: CreateFoundationService,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.createFoundationForProject.bind(this),
      ProjectCreatedWithFoundationEvent.name,
    )
  }

  async createFoundationForProject({
    project,
  }: ProjectCreatedWithFoundationEvent) {
    await this.createFoundationService.execute({ project })
  }
}
