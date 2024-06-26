import { envSchema } from '@infra/env'
import { EnvModule } from '@infra/env/Env.module'
import { FilesModule } from '@modules/files/Files.module'
import { FoldersModule } from '@modules/folders/Folders.module'
import { FoundationsModule } from '@modules/foundations/Foundations.module'
import { PersonsModule } from '@modules/persons/Persons.module'
import { ProjectsModule } from '@modules/projects/Projects.module'
import { TimelinesModule } from '@modules/timelines/Timelines.module'
import { UsersModule } from '@modules/users/Users.module'
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

    UsersModule,
    ProjectsModule,
    FoundationsModule,
    PersonsModule,
    TimelinesModule,
    FilesModule,
    FoldersModule,
  ],
})
export class AppModule {}
