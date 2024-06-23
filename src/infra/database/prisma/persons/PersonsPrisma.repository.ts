import { PersonsRepository } from '@modules/persons/repositories/Persons.repository'
import { Person } from '@modules/persons/entities/Person'
import { PersonWithParents } from '@modules/persons/valuesObjects/PersonWithParents'
import { DomainEvents } from '@shared/core/events/DomainEvents'
import { PersonWithDetails } from '@modules/persons/valuesObjects/PersonWithDetails'
import { Injectable } from '@nestjs/common'
import { PrismaContext, PrismaService } from '../Prisma.service'
import { PersonsPrismaMapper } from './PersonsPrisma.mapper'

@Injectable()
export class PersonsPrismaRepository
  implements PersonsRepository<PrismaContext>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PersonsPrismaMapper,
  ) {}

  async create(person: Person, ctx?: PrismaContext): Promise<void> {
    const db = ctx?.prisma ?? this.prisma

    await db.person.create({
      data: this.mapper.toPersistence(person),
    })

    DomainEvents.dispatchEventsForAggregate(person.id)
  }

  async findById(id: string, ctx?: PrismaContext): Promise<Person | null> {
    const db = ctx?.prisma ?? this.prisma

    const person = await db.person.findUnique({
      where: { id },
    })
    if (!person) return null

    return this.mapper.toDomain(person)
  }

  findAll(): Promise<Person[]> {
    throw new Error('Method not implemented.')
  }

  async save(person: Person, ctx?: PrismaContext): Promise<void> {
    const db = ctx?.prisma ?? this.prisma

    await db.person.update({
      where: { id: person.id.toValue() },
      data: this.mapper.toPersistence(person),
    })

    DomainEvents.dispatchEventsForAggregate(person.id)
  }

  delete(_id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findManyByProjectId(
    projectId: string,
    ctx?: PrismaContext,
  ): Promise<Person[]> {
    const db = ctx?.prisma ?? this.prisma

    const persons = await db.person.findMany({
      where: {
        projectId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return persons.map(this.mapper.toDomain)
  }

  async findManyWithParentsByProjectId(
    projectId: string,
    ctx?: PrismaContext,
  ): Promise<PersonWithParents[]> {
    const db = ctx?.prisma ?? this.prisma

    const persons = await db.person.findMany({
      where: {
        projectId,
        deletedAt: null,
      },
      include: {
        affiliation: {
          select: {
            fatherId: true,
            motherId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return persons.map(this.mapper.toDomainWithParrents)
  }

  async findWithParentsById(
    id: string,
    ctx?: PrismaContext,
  ): Promise<PersonWithParents | null> {
    const db = ctx?.prisma ?? this.prisma

    const person = await db.person.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        affiliation: {
          select: {
            fatherId: true,
            motherId: true,
          },
        },
      },
    })

    if (!person) return null

    return this.mapper.toDomainWithParrents(person)
  }

  async findWithDetailsById(
    id: string,
    ctx?: PrismaContext,
  ): Promise<PersonWithDetails | null> {
    const db = ctx?.prisma ?? this.prisma

    const person = await db.person.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        affiliation: {
          select: {
            fatherId: true,
            motherId: true,
          },
        },
        events: {
          select: {
            type: true,
            event: true,
          },
          where: {
            type: {
              in: ['BIRTH', 'DEATH'],
            },
          },
        },
      },
    })

    if (!person) return null

    return this.mapper.toDomainWithDetails(person)
  }
}
