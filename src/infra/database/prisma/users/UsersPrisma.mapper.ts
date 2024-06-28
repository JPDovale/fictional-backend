import { User } from '@modules/users/entities/User'
import {
  Prisma,
  User as UserFile,
  Subscription as SubscriptionFile,
  SubscriptionStatus as SubscriptionStatusFile,
} from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { RepositoryMapper } from '@shared/core/contracts/Repository'
import { Username } from '@modules/users/valueObjects/Username'
import { UniqueId } from '@shared/core/valueObjects/UniqueId'
import {
  Subscription,
  SubscriptionStatus,
} from '@modules/products/entities/Subscription'

type UserWithSubscriptionFile = UserFile & {
  subscription?: SubscriptionFile | null
}

@Injectable()
export class UsersPrismaMapper extends RepositoryMapper<
  User,
  UserWithSubscriptionFile,
  Prisma.UserUncheckedCreateInput
> {
  toDomain(raw: UserWithSubscriptionFile): User {
    const subscription = raw.subscription
      ? this.subscriptionToDomain(raw.subscription)
      : null

    const user = User.create(
      {
        name: raw.name,
        username: Username.create(raw.username),
        password: raw.password,
        email: raw.email,
        imageUrl: raw.imageUrl,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt,
        verified: raw.verified,
        authId: raw.authId,
        subscription,
        customerId: raw.customerId,
      },
      UniqueId.create(raw.id),
    )

    return user
  }

  toPersistence(entity: User): Prisma.UserUncheckedCreateInput {
    return {
      id: entity.id.toString(),
      createdAt: entity.createdAt,
      deletedAt: entity.deletedAt,
      email: entity.email,
      imageUrl: entity.imageUrl,
      name: entity.name,
      password: entity.password,
      updatedAt: entity.updatedAt,
      authId: entity.authId,
      verified: entity.verified,
      username: entity.username.toString(),
      customerId: entity.customerId,
    }
  }

  subscriptionToPersistence(
    sub: Subscription,
  ): Prisma.SubscriptionUncheckedCreateInput {
    return {
      id: sub.id.toString(),
      priceId: sub.priceId,
      createdAt: sub.createdAt,
      expiredAt: sub.expiredAt,
      status: sub.status as SubscriptionStatusFile,
      deletedAt: sub.trashedAt,
      subscriptionId: sub.subscriptionId.toString(),
      userId: sub.userId.toString(),
      updatedAt: sub.updatedAt,
    }
  }

  subscriptionToDomain(sub: SubscriptionFile): Subscription {
    return Subscription.create(
      {
        priceId: sub.priceId,
        status: sub.status as SubscriptionStatus,
        createdAt: sub.createdAt,
        expiredAt: sub.expiredAt,
        trashedAt: sub.deletedAt,
        subscriptionId: sub.subscriptionId,
        userId: UniqueId.create(sub.userId),
        updatedAt: sub.updatedAt,
      },
      UniqueId.create(sub.id),
    )
  }
}
