import { Repository } from '@shared/core/contracts/Repository'
import { User } from '../entities/User'
import { Subscription } from '@modules/products/entities/Subscription'

export abstract class UsersRepository<T = unknown> extends Repository<User, T> {
  abstract findByEmail(email: string): Promise<User | null>
  abstract findByCustomerId(customerId: string, ctx?: T): Promise<User | null>
  abstract findFirst(): Promise<User | null>
  abstract createSubscription(subscription: Subscription): Promise<void>
  abstract saveSubscription(subscription: Subscription): Promise<void>
}
