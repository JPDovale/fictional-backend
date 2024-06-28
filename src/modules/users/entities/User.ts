import { Entity } from '@shared/core/entities/Entity'
import { Optional } from '@shared/core/types/Optional'
import { UniqueId } from '@shared/core/valueObjects/UniqueId'
import { Username } from '../valueObjects/Username'
import {
  Subscription,
  SubscriptionStatus,
} from '@modules/products/entities/Subscription'

/**
 * @template UserProps - Properties in user
 */
export interface UserProps {
  name: string
  customerId: string | null
  username: Username
  subscription: Subscription | null
  email: string
  password: string | null
  authId: string | null
  imageUrl: string | null
  verified: boolean
  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
}

/**
 * @class User - Define a user on system
 * @extends {Entity<UserProps>} - Extend a base entity
 */
export class User extends Entity<UserProps> {
  static create(
    props: Optional<
      UserProps,
      | 'createdAt'
      | 'username'
      | 'updatedAt'
      | 'authId'
      | 'imageUrl'
      | 'verified'
      | 'deletedAt'
      | 'password'
      | 'customerId'
      | 'subscription'
    >,
    id?: UniqueId,
  ) {
    const propsUser: UserProps = {
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? null,
      username: props.username ?? Username.create(props.name),
      email: props.email,
      name: props.name,
      customerId: props.customerId ?? null,
      password: props.password ?? null,
      authId: props.authId ?? null,
      imageUrl: props.imageUrl ?? null,
      verified: props.verified ?? false,
      deletedAt: props.deletedAt ?? null,
      subscription: props.subscription ?? null,
    }

    const user = new User(propsUser, id)

    return user
  }

  get name(): string {
    return this.props.name
  }

  set name(name: string | undefined) {
    if (!name) return

    this.props.name = name
    this.touch()
  }

  get email(): string {
    return this.props.email
  }

  set email(email: string | undefined) {
    if (!email) return

    this.props.email = email
    this.touch()
  }

  get username(): Username {
    return this.props.username
  }

  set username(username: Username | string | undefined) {
    if (!username) return

    if (typeof username === 'string') {
      this.props.username = Username.create(username)
      this.touch()
      return
    }

    this.props.username = username
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get authId(): string | null {
    return this.props.authId
  }

  set authId(authId: string | null | undefined) {
    if (authId === undefined) return

    this.props.authId = authId
    this.touch()
  }

  get imageUrl(): string | null {
    return this.props.imageUrl
  }

  set imageUrl(imageUrl: string | null | undefined) {
    if (imageUrl === undefined) return

    this.props.imageUrl = imageUrl
    this.touch()
  }

  get verified(): boolean {
    return this.props.verified
  }

  set verified(verified: boolean | undefined) {
    if (verified === undefined) return

    this.props.verified = verified
    this.touch()
  }

  get customerId(): string | null {
    return this.props.customerId
  }

  set customerId(customerId: string | null | undefined) {
    if (customerId === undefined) return
    this.props.customerId = customerId
    this.touch()
  }

  get password(): string | null {
    return this.props.password
  }

  get subscription(): Subscription | null {
    return this.props.subscription
  }

  set subscription(subscription: Subscription | null | undefined) {
    if (subscription === undefined) return

    this.props.subscription = subscription
    this.touch()
  }

  get deletedAt() {
    return this.props.deletedAt
  }

  isSubscriber() {
    return this.subscription?.status === SubscriptionStatus.PAYED
  }

  touch() {
    this.props.updatedAt = new Date()
  }
}
