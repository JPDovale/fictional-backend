import { AttributeMutationsRepository } from '@modules/persons/repositories/AttributeMutations.repository'
import { AttributeMutation } from '@modules/persons/entities/AttributeMutation'
import { Injectable } from '@nestjs/common'
import { PrismaContext, PrismaService } from '../Prisma.service'
import { AttributeMutationsPrismaMapper } from './AttributeMutationsPrisma.mapper'

@Injectable()
export class AttributeMutationsPrismaRepository
  implements AttributeMutationsRepository<PrismaContext>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: AttributeMutationsPrismaMapper,
  ) {}

  async createMany(
    data: AttributeMutation[],
    ctx?: PrismaContext,
  ): Promise<void> {
    const db = ctx?.prisma ?? this.prisma

    await db.attributeMutation.createMany({
      data: data.map(this.mapper.toPersistence),
    })
  }

  async saveMany(
    data: AttributeMutation[],
    ctx?: PrismaContext,
  ): Promise<void> {
    const db = ctx?.prisma ?? this.prisma

    const updatesPromises = data.map((attributeMutation) =>
      db.attributeMutation.update({
        where: {
          id: attributeMutation.id.toString(),
        },
        data: this.mapper.toPersistence(attributeMutation),
      }),
    )

    await Promise.all(updatesPromises)
  }

  async findManyByAttributeId(
    attributeId: string,
    ctx?: PrismaContext,
  ): Promise<AttributeMutation[]> {
    const db = ctx?.prisma ?? this.prisma

    const mutations = await db.attributeMutation.findMany({
      where: {
        attributeId,
        deletedAt: null,
      },
      include: {
        event: {
          select: {
            date: true,
            importanceLevel: true,
          },
        },
      },
    })

    return mutations.map(this.mapper.toDomain)
  }

  create(_data: AttributeMutation, _ctx?: undefined): Promise<void> {
    throw new Error('Method not implemented.')
  }

  findById(_id: string, _ctx?: undefined): Promise<AttributeMutation | null> {
    throw new Error('Method not implemented.')
  }

  findAll(_ctx?: undefined): Promise<AttributeMutation[]> {
    throw new Error('Method not implemented.')
  }

  async save(data: AttributeMutation, ctx?: PrismaContext): Promise<void> {
    const db = ctx?.prisma ?? this.prisma

    await db.attributeMutation.update({
      where: {
        id: data.id.toString(),
      },
      data: this.mapper.toPersistence(data),
    })
  }

  delete(_id: string, _ctx?: undefined): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
