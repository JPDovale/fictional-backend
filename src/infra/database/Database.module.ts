import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/Prisma.service'
import { TransactorService } from './transactor/contracts/Transactor.service'
import { TransactorManager } from './transactor/implementations/TransactorManager'
import { UsersRepository } from '@modules/users/repositories/Users.repository'
import { UsersPrismaRepository } from './prisma/users/UsersPrisma.repository'
import { UsersPrismaMapper } from './prisma/users/UsersPrisma.mapper'
import { RefreshTokensPrismaMapper } from './prisma/users/RefreshTokensPrisma.mapper'
import { RefreshTokensRepository } from '@modules/users/repositories/RefreshTokens.repository'
import { RefreshTokensPrismaRepository } from './prisma/users/RefreshTokensPrisma.repository'

@Module({
  providers: [
    PrismaService,

    // Transactor
    {
      provide: TransactorService,
      useClass: TransactorManager,
    },

    // users
    UsersPrismaMapper,
    RefreshTokensPrismaMapper,
    {
      provide: UsersRepository,
      useClass: UsersPrismaRepository,
    },
    {
      provide: RefreshTokensRepository,
      useClass: RefreshTokensPrismaRepository,
    },
  ],
  exports: [
    PrismaService,
    TransactorService,
    UsersRepository,
    RefreshTokensRepository,
  ],
})
export class DatabaseModule {}
