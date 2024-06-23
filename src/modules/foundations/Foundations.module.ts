import { DatabaseModule } from '@infra/database/Database.module'
import { Module } from '@nestjs/common'
import { GetFoundationService } from './services/GetFoundation.service'
import { GetFoundationController } from './controllers/GetFoundation.controller'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import { FoundationPresenter } from './presenters/Foundation.presenter'
import { UpdateFoundationService } from './services/UpdateFoundation.service'
import { UpdateFoundationController } from './controllers/UpdateFoundation.controller'
import { TextModule } from '@providers/text/Text.module'

@Module({
  imports: [DatabaseModule, TextModule],
  controllers: [GetFoundationController, UpdateFoundationController],
  providers: [
    GetFoundationService,
    UpdateFoundationService,
    ErrorPresenter,
    FoundationPresenter,
  ],
})
export class FoundationsModule {}
