import {
  AffiliationsRepository,
  FindByFatherAndMotherIdProps,
} from '@modules/affiliations/repositories/Affiliations.repository'
import { Affiliation } from '@modules/affiliations/entities/Affiliation'
import { Injectable } from '@nestjs/common'
import { PrismaContext, PrismaService } from '../Prisma.service'
import { AffiliationsPrismaMapper } from './AffiliationsPrisma.mapper'

@Injectable()
export class AffiliationsPrismaRepository
  implements AffiliationsRepository<PrismaContext>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: AffiliationsPrismaMapper,
  ) {}

  async create(affiliation: Affiliation, ctx?: PrismaContext): Promise<void> {
    const db = ctx?.prisma ?? this.prisma

    await db.affiliation.create({
      data: this.mapper.toPersistence(affiliation),
    })
  }

  async findById(id: string, ctx?: PrismaContext): Promise<Affiliation | null> {
    const db = ctx?.prisma ?? this.prisma

    const affiliation = await db.affiliation.findFirst({
      where: { id },
    })

    if (!affiliation) return null

    return this.mapper.toDomain(affiliation)
  }

  async findByPersonId(
    personId: string,
    ctx?: PrismaContext,
  ): Promise<Affiliation[]> {
    const db = ctx?.prisma ?? this.prisma

    const affiliations = await db.affiliation.findMany({
      where: {
        OR: [{ fatherId: personId }, { motherId: personId }],
      },
    })

    return affiliations.map(this.mapper.toDomain)
  }

  async saveMany(
    affiliations: Affiliation[],
    ctx?: PrismaContext | undefined,
  ): Promise<void> {
    const db = ctx?.prisma ?? this.prisma

    const updatesPromises = affiliations.map((affiliation) => {
      if (!affiliation.fatherId && !affiliation.motherId) {
        return db.affiliation.delete({
          where: {
            id: affiliation.id.toString(),
          },
        })
      }

      return db.affiliation.update({
        where: {
          id: affiliation.id.toString(),
        },
        data: this.mapper.toPersistence(affiliation),
      })
    })

    await Promise.all(updatesPromises)
  }

  findAll(): Promise<Affiliation[]> {
    throw new Error('Method not implemented.')
  }

  save(_affiliation: Affiliation): Promise<void> {
    throw new Error('Method not implemented.')
  }

  delete(_id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findByFatherAndMotherId(
    { fatherId, motherId }: FindByFatherAndMotherIdProps,
    ctx?: PrismaContext,
  ): Promise<Affiliation | null> {
    if (!fatherId && !motherId) {
      throw new Error('Invalid params')
    }

    const db = ctx?.prisma ?? this.prisma

    const affiliation = await db.affiliation.findFirst({
      where: {
        fatherId,
        motherId,
      },
    })

    if (!affiliation) return null

    return this.mapper.toDomain(affiliation)
  }
}
