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
import { FirebaseService } from './firebase/Firebase.service'
import { EnvService } from '@infra/env/Env.service'
import { ProjectsPrismaMapper } from './prisma/projects/ProjectsPrisma.mapper'
import { ProjectsRepository } from '@modules/projects/repositories/Projects.repository'
import { ProjectsPrismaRepository } from './prisma/projects/ProjectsPrisma.repository'
import { AffiliationsPrismaMapper } from './prisma/affiliations/AffiliationsPrisma.mapper'
import { AffiliationsRepository } from '@modules/affiliations/repositories/Affiliations.repository'
import { AffiliationsPrismaRepository } from './prisma/affiliations/AffiliationsPrisma.repository'
import { FilesPrismaMapper } from './prisma/files/FilesPrisma.mapper'
import { FilesRepository } from '@modules/files/repositories/Files.repository'
import { FilesPrismaRepository } from './prisma/files/FilesPrisma.repository'
import { FoundationsPrismaMapper } from './prisma/foundations/FoundationsPrisma.mapper'
import { FoundationsRepository } from '@modules/foundations/repositories/Foundations.repository'
import { FoundationsPrismaRepository } from './prisma/foundations/FoundationsPrisma.repository'
import { AttributeMutationsPrismaMapper } from './prisma/persons/AttributeMutationsPrisma.mapper'
import { AttributesPrismaMapper } from './prisma/persons/AttributesPrisma.mapper'
import { PersonsPrismaMapper } from './prisma/persons/PersonsPrisma.mapper'
import { AttributeMutationsRepository } from '@modules/persons/repositories/AttributeMutations.repository'
import { AttributeMutationsPrismaRepository } from './prisma/persons/AttributeMutationsPrisma.repository'
import { AttributesRepository } from '@modules/persons/repositories/Attributes.repository'
import { AttributesPrismaRepository } from './prisma/persons/AttributesPrisma.repository'
import { PersonsRepository } from '@modules/persons/repositories/Persons.repository'
import { PersonsPrismaRepository } from './prisma/persons/PersonsPrisma.repository'
import { EventsPrismaMapper } from './prisma/timelines/EventsPrisma.mapper'
import { EventsToPersonPrismaMapper } from './prisma/timelines/EventsToPersonPrisma.mapper'
import { TimelinesPrismaMapper } from './prisma/timelines/TimelinesPrisma.mapper'
import { EventsRepository } from '@modules/timelines/repositories/Events.repository'
import { EventsPrismaRepository } from './prisma/timelines/EventsPrisma.repository'
import { EventsToPersonRepository } from '@modules/timelines/repositories/EventsToPerson.repository'
import { EventsToPersonPrismaRepository } from './prisma/timelines/EventsToPersonPrisma.repository'
import { TimelinesRepository } from '@modules/timelines/repositories/Timelines.repository'
import { TimelinesPrismaRepository } from './prisma/timelines/TimelinesPrisma.repository'

@Module({
  providers: [
    EnvService,
    PrismaService,
    FirebaseService,

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

    // Projects
    ProjectsPrismaMapper,
    {
      provide: ProjectsRepository,
      useClass: ProjectsPrismaRepository,
    },

    // Affliations
    AffiliationsPrismaMapper,
    {
      provide: AffiliationsRepository,
      useClass: AffiliationsPrismaRepository,
    },

    // Files
    FilesPrismaMapper,
    {
      provide: FilesRepository,
      useClass: FilesPrismaRepository,
    },

    // Foundations
    FoundationsPrismaMapper,
    {
      provide: FoundationsRepository,
      useClass: FoundationsPrismaRepository,
    },

    // Persons
    AttributeMutationsPrismaMapper,
    AttributesPrismaMapper,
    PersonsPrismaMapper,
    {
      provide: AttributeMutationsRepository,
      useClass: AttributeMutationsPrismaRepository,
    },
    {
      provide: AttributesRepository,
      useClass: AttributesPrismaRepository,
    },
    {
      provide: PersonsRepository,
      useClass: PersonsPrismaRepository,
    },

    // Timelines
    EventsPrismaMapper,
    EventsToPersonPrismaMapper,
    TimelinesPrismaMapper,
    {
      provide: EventsRepository,
      useClass: EventsPrismaRepository,
    },
    {
      provide: EventsToPersonRepository,
      useClass: EventsToPersonPrismaRepository,
    },
    {
      provide: TimelinesRepository,
      useClass: TimelinesPrismaRepository,
    },
  ],
  exports: [
    PrismaService,
    FirebaseService,
    TransactorService,
    UsersRepository,
    RefreshTokensRepository,
    ProjectsRepository,
    AffiliationsRepository,
    FilesRepository,
    FoundationsRepository,
    AttributeMutationsRepository,
    AttributesRepository,
    PersonsRepository,
    EventsRepository,
    EventsToPersonRepository,
    TimelinesRepository,
  ],
})
export class DatabaseModule {}
