import { DatabaseModule } from '@infra/database/Database.module'
import { Module } from '@nestjs/common'
import { GetFileService } from './services/GetFile.service'
import { FilePresenter } from './presenters/File.presenter'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import { UpdateFileService } from './services/UpdateFile.service'
import { GetFileController } from './controllers/GetFile.controller'
import { UpdateFileController } from './controllers/UpdateFile.controller'
import { TextModule } from '@providers/text/Text.module'
import { CreateFileController } from './controllers/CreateFile.controller'
import { CreateFileService } from './services/CreateFile.service'
import { DeleteFileService } from './services/DeleteFile.service'
import { DeleteFileController } from './controllers/DeleteFile.controller'

@Module({
  imports: [DatabaseModule, TextModule],
  controllers: [
    GetFileController,
    UpdateFileController,
    CreateFileController,
    DeleteFileController,
  ],
  providers: [
    GetFileService,
    UpdateFileService,
    DeleteFileService,
    CreateFileService,
    ErrorPresenter,
    FilePresenter,
  ],
})
export class FilesModule {}
