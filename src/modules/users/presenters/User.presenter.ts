import { Presenter, PresenterProps } from '@shared/core/contracts/Presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { Injectable } from '@nestjs/common'
import { User } from '../entities/User'
import { makeImageLocation } from '@utils/makeImageLocation'

export interface UserResponse {
  id: string
  name: string
  email: string
  isSocialLogin: boolean
  username: string
  isSubscriber: boolean
  verified: boolean
  imageUrl: string | null
  createdAt: Date
  updatedAt: Date | null
}

export interface UserPresented {
  user: UserResponse
}

export interface UsersPresented {
  users: UserResponse[]
}

@Injectable()
export class UserPresenter
  implements Presenter<User, UserPresented, UsersPresented>
{
  private parse(raw: User): UserResponse {
    return {
      id: raw.id.toString(),
      name: raw.name,
      email: raw.email,
      isSocialLogin: !!raw.authId,
      username: raw.username.toString(),
      isSubscriber: raw.isSubscriber(),
      imageUrl: raw.imageUrl?.startsWith('http')
        ? raw.imageUrl
        : makeImageLocation(raw.imageUrl),
      verified: raw.verified,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  }

  present(
    raw: User,
    status: StatusCode = StatusCode.OK,
  ): PresenterProps<UserPresented> {
    return {
      status,
      data: {
        user: this.parse(raw),
      },
    }
  }

  presentMany(raws: User[]): PresenterProps<UsersPresented> {
    return {
      status: StatusCode.OK,
      data: {
        users: raws.map(this.parse),
      },
    }
  }
}
