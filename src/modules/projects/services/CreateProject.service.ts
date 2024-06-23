import { UserNotFound } from '@modules/users/errors/UserNotFound.error'
import { Service } from '@shared/core/contracts/Service'
import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@shared/core/errors/Either'
import { UsersRepository } from '@modules/users/repositories/Users.repository'
import { CannotGetSafeLocationForImage } from '@providers/base/images/errors/CannotGetSafeLocationForImage.error'
import { Project } from '../entities/Project'
import { BuildBlock, BuildBlocks } from '../valueObjects/BuildBlocks'
import { ProjectsRepository } from '../repositories/Projects.repository'
import { CreateFoundationService } from '@modules/foundations/services/CreateFoundation.service'
import { CreateTimelineService } from '@modules/timelines/services/CreateTimeline.service'
import { TransactorService } from '@infra/database/transactor/contracts/Transactor.service'

type Request = {
  name: string
  image?: string
  buildBlocks: BuildBlock[]
  userId: string
}

type PossibleErrors = UserNotFound | CannotGetSafeLocationForImage

type Response = {
  project: Project
}

@Injectable()
export class CreateProjectService
  implements Service<Request, PossibleErrors, Response>
{
  constructor(
    private readonly transactor: TransactorService,
    private readonly usersRepository: UsersRepository,
    private readonly projectsRepository: ProjectsRepository,
    private readonly createFoundationService: CreateFoundationService,
    private readonly createTimeLineService: CreateTimelineService,
  ) {}

  async execute({
    name,
    image,
    buildBlocks,
    userId,
  }: Request): Promise<Either<PossibleErrors, Response>> {
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      return left(new UserNotFound())
    }

    const project = Project.create({
      name,
      userId: user.id,
      buildBlocks: BuildBlocks.create(buildBlocks),
      image,
    })

    const transaction = this.transactor.start()

    transaction.add(async (ctx) => {
      await this.projectsRepository.create(project, ctx)

      if (project.buildBlocks.implements(BuildBlock.FOUNDATION)) {
        await this.createFoundationService.execute(
          {
            project,
          },
          ctx,
        )
      }

      if (project.buildBlocks.implements(BuildBlock.TIME_LINES)) {
        await this.createTimeLineService.execute(
          {
            project,
            name: 'Padrão',
          },
          ctx,
        )
      }
    })

    await this.transactor.execute(transaction)

    return right({ project })
  }
}
