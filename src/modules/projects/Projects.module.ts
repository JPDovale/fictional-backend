import { DatabaseModule } from '@infra/database/Database.module'
import { Module } from '@nestjs/common'
import { GetProjectsController } from './controllers/GetProjects.controller'
import { GetProjectsService } from './services/GetProjects.service'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import { ProjectPresenter } from './presenters/Project.presenter'
import { GetUploadUrlController } from './controllers/GetUploadUrl.controller'
import { GetUploadUrlService } from './services/GetUploadUrl.service'
import { StorageModule } from '@infra/storage/Storage.module'
import { CreateProjectController } from './controllers/CreateProject.controller'
import { CreateProjectService } from './services/CreateProject.service'
import { GetProjectService } from './services/GetProject.service'
import { GetProjectController } from './controllers/GetProject.controller'
import { CreateFoundationService } from '@modules/foundations/services/CreateFoundation.service'
import { CreateTimelineService } from '@modules/timelines/services/CreateTimeline.service'
import { EmptyPresenter } from '@infra/presenters/Empty.presente'
import { DeleteProjectController } from './controllers/DeleteProject.controller'
import { DeleteProjectService } from './services/DeleteProject.service'
import { UpdateProjectBuildBlocksService } from './services/UpdateProjectBuildBlocks.service'
import { UpdateProjectBuildBlocksController } from './controllers/UpdateProjectBuildBlocks.controller'

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [
    GetProjectsController,
    GetUploadUrlController,
    CreateProjectController,
    GetProjectController,
    DeleteProjectController,
    UpdateProjectBuildBlocksController,
  ],
  providers: [
    GetProjectsService,
    GetUploadUrlService,
    CreateProjectService,
    GetProjectService,
    CreateFoundationService,
    CreateTimelineService,
    DeleteProjectService,
    UpdateProjectBuildBlocksService,
    ErrorPresenter,
    ProjectPresenter,
    EmptyPresenter,
  ],
})
export class ProjectsModule {}
