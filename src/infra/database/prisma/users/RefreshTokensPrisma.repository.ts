import { RefreshTokensRepository } from '@modules/users/repositories/RefreshTokens.repository'
import { PrismaContext, PrismaService } from '../Prisma.service'
import { RefreshToken } from '@modules/users/entities/RefreshToken'
import { RefreshTokensPrismaMapper } from './RefreshTokensPrisma.mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
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

  async delete(id: string, ctx?: PrismaContext | undefined): Promise<void> {
    const db = ctx?.prisma ?? this.prisma

    try {
      await db.refreshToken.delete({
        where: {
          id,
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

  async findByUserIdAndToken(
    userId: string,
    token: string,
  ): Promise<RefreshToken | null> {
    const refreshToken = await this.prisma.refreshToken.findFirst({
      where: {
        userId,
        token,
      },
    })

    if (!refreshToken) return null

    return this.mapper.toDomain(refreshToken)
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    })
  }
}
