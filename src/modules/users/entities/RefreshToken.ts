import { Optional } from '@shared/core/types/Optional'
import { AggregateRoot } from '@shared/core/entities/AggregateRoot'
import { UniqueId } from '@shared/core/valueObjects/UniqueId'

export interface RefreshTokenProps {
  token: string
  expiresIn: Date
  expiredAt: Date | null
  createdAt: Date
  userId: UniqueId
}

export class RefreshToken extends AggregateRoot<RefreshTokenProps> {
  static create(
    props: Optional<RefreshTokenProps, 'createdAt' | 'expiredAt'>,
    id?: UniqueId,
  ): RefreshToken {
    const refreshTokenProps: RefreshTokenProps = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      expiredAt: props.expiredAt ?? null,
    }

    const refreshToken = new RefreshToken(refreshTokenProps, id)

    return refreshToken
  }

  get token() {
    return this.props.token
  }

  get expiresIn() {
    return this.props.expiresIn
  }

  get expiredAt() {
    return this.props.expiredAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  get userId() {
    return this.props.userId
  }
}
