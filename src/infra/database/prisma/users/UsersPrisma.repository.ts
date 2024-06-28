import { Injectable } from '@nestjs/common'
import { UsersRepository } from '@modules/users/repositories/Users.repository'
import { PrismaContext, PrismaService } from '../Prisma.service'
import { User } from '@modules/users/entities/User'
import { UsersPrismaMapper } from './UsersPrisma.mapper'
import { Subscription } from '@modules/products/entities/Subscription'

@Injectable()
export class UsersPrismaRepository implements UsersRepository<PrismaContext> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: UsersPrismaMapper,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) return null

    return this.mapper.toDomain(user)
  }

  findFirst(): Promise<User | null> {
    throw new Error('Method not implemented.')
  }

  async create(data: User, ctx?: PrismaContext | undefined): Promise<void> {
    const db = ctx?.prisma ?? this.prisma

    await db.user.create({
      data: this.mapper.toPersistence(data),
    })
  }

  async findById(
    id: string,
    ctx?: PrismaContext | undefined,
  ): Promise<User | null> {
    const db = ctx?.prisma ?? this.prisma

    const user = await db.user.findUnique({
      where: {
        id,
      },
      include: {
        subscription: true,
      },
    })

    if (!user) return null

    return this.mapper.toDomain(user)
  }

  async findByCustomerId(
    customerId: string,
    ctx?: PrismaContext | undefined,
  ): Promise<User | null> {
    const db = ctx?.prisma ?? this.prisma

    const user = await db.user.findUnique({
      where: {
        customerId,
      },
      include: {
        subscription: true,
      },
    })

    if (!user) return null

    return this.mapper.toDomain(user)
  }

  findAll(_ctx?: PrismaContext | undefined): Promise<User[]> {
    throw new Error('Method not implemented.')
  }

  async save(data: User, ctx?: PrismaContext | undefined): Promise<void> {
    const db = ctx?.prisma ?? this.prisma

    await db.user.update({
      where: {
        id: data.id.toString(),
      },
      data: this.mapper.toPersistence(data),
    })
  }

  delete(_id: string, _ctx?: PrismaContext | undefined): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async createSubscription(subscription: Subscription): Promise<void> {
    await this.prisma.subscription.create({
      data: this.mapper.subscriptionToPersistence(subscription),
    })
  }

  async saveSubscription(subscription: Subscription): Promise<void> {
    await this.prisma.subscription.update({
      where: { id: subscription.id.toString() },
      data: this.mapper.subscriptionToPersistence(subscription),
    })
  }
}
