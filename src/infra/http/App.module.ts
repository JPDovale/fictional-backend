import { envSchema } from '@infra/env'
import { EnvModule } from '@infra/env/Env.module'
import { UserModule } from '@modules/users/User.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from '@providers/auth/Auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    EnvModule,

    UserModule,
    // ProjectModule,
  ],
})
export class AppModule {}
