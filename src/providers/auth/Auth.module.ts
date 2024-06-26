import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './strategys/JwtStrategy'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './guards/JwtAuth.guard'
import { EnvModule } from '@infra/env/Env.module'
import { EnvService } from '@infra/env/Env.service'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'auth0' }),
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory(env: EnvService) {
        const privateKey = env.get('JWT_PRIVATE_kEY')
        const publicKey = env.get('JWT_PUBLIC_KEY')

        return {
          signOptions: {
            algorithm: 'RS256',
          },
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
        }
      },
    }),
  ],
  providers: [
    JwtStrategy,
    EnvService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
