import { AggregateRoot } from '@shared/core/entities/AggregateRoot'
import { Optional } from '@shared/core/types/Optional'
import { UniqueId } from '@shared/core/valueObjects/UniqueId'

export enum SubscriptionStatus {
  PAYED = 'PAYED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
}

interface SubscriptionProps {
  subscriptionId: string
  status: SubscriptionStatus
  userId: UniqueId
  priceId: string
  createdAt: Date
  updatedAt: Date | null
  trashedAt: Date | null
  expiredAt: Date | null
}

export class Subscription extends AggregateRoot<SubscriptionProps> {
  static create(
    props: Optional<
      SubscriptionProps,
      'createdAt' | 'updatedAt' | 'trashedAt' | 'expiredAt' | 'status'
    >,
    id?: UniqueId,
  ) {
    const subscriptionPros: SubscriptionProps = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? null,
      trashedAt: props.trashedAt ?? null,
      expiredAt: props.expiredAt ?? null,
      status: props.status ?? SubscriptionStatus.PENDING,
    }

    const subscription = new Subscription(subscriptionPros, id)

    return subscription
  }

  get subscriptionId(): string {
    return this.props.subscriptionId
  }

  set subscriptionId(subscriptionId: string | undefined) {
    if (subscriptionId === undefined) return
    this.props.subscriptionId = subscriptionId
    this.touch()
  }

  get status(): SubscriptionStatus {
    return this.props.status
  }

  set status(status: SubscriptionStatus | null | undefined) {
    if (status === undefined) return
    if (status === null) this.props.status = SubscriptionStatus.CANCELLED
    if (status) this.props.status = status

    this.touch()
  }

  get userId(): UniqueId {
    return this.props.userId
  }

  get priceId(): string {
    return this.props.priceId
  }

  set priceId(priceId: string | undefined) {
    if (priceId === undefined) return
    this.props.priceId = priceId
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get trashedAt() {
    return this.props.trashedAt
  }

  get expiredAt() {
    return this.props.expiredAt
  }

  touch() {
    this.props.updatedAt = new Date()
  }
}
