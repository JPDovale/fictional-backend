import { DatabaseModule } from '@infra/database/Database.module'
import { Module } from '@nestjs/common'
import { CreateFolderController } from './controllers/CreateFolder.controller'
import { CreateFolderService } from './services/CreateFolder.service'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import { EmptyPresenter } from '@infra/presenters/Empty.presente'
import { GetFoldersService } from './services/GetFolders.service'
import { GetFoldersController } from './controllers/GetFolders.controller'
import { FolderPresenter } from './presenters/Folder.presenter'
import { FolderWithChildsPresenter } from './presenters/FolderWithChilds.presenter'
import { UpdateFolderController } from './controllers/UpdateFolder.controller'
import { UpdateFolderService } from './services/UpdateFolder.service'
import { DeleteFolderController } from './controllers/DeleteFolder.controller'
import { DeleteFoldersService } from './services/DeleteFolders.service'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateFolderController,
    GetFoldersController,
    UpdateFolderController,
    DeleteFolderController,
  ],
  providers: [
    CreateFolderService,
    GetFoldersService,
    UpdateFolderService,
    DeleteFoldersService,
    ErrorPresenter,
    EmptyPresenter,
    FolderPresenter,
    FolderWithChildsPresenter,
  ],
})
export class FoldersModule {}
