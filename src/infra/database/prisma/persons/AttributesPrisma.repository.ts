import { AttributesRepository } from '@modules/persons/repositories/Attributes.repository'
import { Attribute } from '@modules/persons/entities/Attribute'
import { AttributePreview } from '@modules/persons/valuesObjects/AttributePreview'
import { AttributeMutationsRepository } from '@modules/persons/repositories/AttributeMutations.repository'
import { Injectable } from '@nestjs/common'
import { PrismaContext, PrismaService } from '../Prisma.service'
import { AttributesPrismaMapper } from './AttributesPrisma.mapper'
import { AttributeToPerson } from '@modules/persons/entities/AttributeToPerson'

@Injectable()
export class AttributesPrismaRepository
  implements AttributesRepository<PrismaContext>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: AttributesPrismaMapper,
    private readonly attributeMutationsRepository: AttributeMutationsRepository,
  ) {}

  async create(data: Attribute, ctx?: PrismaContext): Promise<void> {
    const db = ctx?.prisma ?? this.prisma

    await db.attribute.create({
      data: this.mapper.toPersistence(data),
    })
  }

  async findById(id: string, ctx?: PrismaContext): Promise<Attribute | null> {
    const db = ctx?.prisma ?? this.prisma

    const attribute = await db.attribute.findUnique({
      where: { id },
      include: {
        mutations: {
          where: { deletedAt: null },
          include: {
            event: true,
          },
        },
      },
    })

    if (!attribute) return null

    return this.mapper.toDomain(attribute)
  }

  findAll(_ctx?: PrismaContext): Promise<Attribute[]> {
    throw new Error('Method not implemented.')
  }

  async save(data: Attribute, ctx?: PrismaContext): Promise<void> {
    const db = ctx?.prisma ?? this.prisma

    await db.attribute.update({
      where: { id: data.id.toString() },
      data: this.mapper.toPersistence(data),
    })

    const newAttributeMutations = data.mutations.getNewItems()

    if (newAttributeMutations.length !== 0) {
      await this.attributeMutationsRepository.createMany(
        newAttributeMutations,
        ctx,
      )
    }
  }

  delete(_id: string, _ctx?: PrismaContext): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findManyPreviewByProjectId(
    projectId: string,
    ctx?: PrismaContext,
  ): Promise<AttributePreview[]> {
    const db = ctx?.prisma ?? this.prisma

    const personsWithAttributesFiles = await db.person.findMany({
      where: {
        projectId,
        deletedAt: null,
      },
      select: {
        id: true,
        attributes: {
          where: { deletedAt: null },
          select: {
            id: true,
            type: true,
            file: {
              select: {
                id: true,
                content: true,
                title: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    })

    return this.mapper.toDomainPreviewList(personsWithAttributesFiles)
  }

  async createAttributeToPerson(
    attributeToPerson: AttributeToPerson,
    ctx?: PrismaContext | undefined,
  ): Promise<void> {
    const db = ctx?.prisma ?? this.prisma

    await db.person.update({
      where: { id: attributeToPerson.personId.toString() },
      data: {
        attributes: {
          connect: {
            id: attributeToPerson.attributeId.toString(),
          },
        },
      },
    })
  }
}
