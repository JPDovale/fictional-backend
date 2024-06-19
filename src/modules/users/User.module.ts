import { DatabaseModule } from '@infra/database/Database.module'
import { Module } from '@nestjs/common'
import { CreateUserController } from './controllers/CreateUser.controller'
import { CreateUserService } from './services/CreateUser.service'
import { CryptographyModule } from '@providers/cryptography/Cryptography.module'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import { GetUserService } from './services/GetUser.service'
import { GetUserController } from './controllers/GetUser.controller'
import { UserPresenter } from './presenters/User.presenter'
import { LoginUserService } from './services/LoginUser.service'
import { EnvModule } from '@infra/env/Env.module'
import { DateModule } from '@providers/date/Date.module'

@Module({
  imports: [DatabaseModule, CryptographyModule, EnvModule, DateModule],
  providers: [
    CreateUserService,
    GetUserService,
    LoginUserService,
    ErrorPresenter,
    UserPresenter,
  ],
  controllers: [CreateUserController, GetUserController],
})
export class UserModule {}
