import { RefreshTokensRepository } from '@modules/users/repositories/RefreshTokens.repository'
import { PrismaContext, PrismaService } from '../Prisma.service'
import { RefreshToken } from '@modules/users/entities/RefreshToken'
import { RefreshTokensPrismaMapper } from './RefreshTokensPrisma.mapper'

export class RefreshTokensPrismaRepository
  implements RefreshTokensRepository<PrismaContext>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: RefreshTokensPrismaMapper,
  ) {}

  async create(
    data: RefreshToken,
    ctx?: PrismaContext | undefined,
  ): Promise<void> {
    const db = ctx?.prisma ?? this.prisma

    await db.refreshToken.create({
      data: this.mapper.toPersistence(data),
    })
  }

  findById(
    _id: string,
    _ctx?: PrismaContext | undefined,
  ): Promise<RefreshToken | null> {
    throw new Error('Method not implemented.')
  }

  findAll(_ctx?: PrismaContext | undefined): Promise<RefreshToken[]> {
    throw new Error('Method not implemented.')
  }

  save(_data: RefreshToken, _ctx?: PrismaContext | undefined): Promise<void> {
    throw new Error('Method not implemented.')
  }

  delete(_id: string, _ctx?: PrismaContext | undefined): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
