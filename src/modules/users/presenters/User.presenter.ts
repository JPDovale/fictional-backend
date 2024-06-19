import { Presenter, PresenterProps } from '@shared/core/contracts/Presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { Injectable } from '@nestjs/common'
import { makeImageLocation } from '@utils/makeImageLocation'
import { User } from '../entities/User'

export interface UserResponse {
  id: string
  name: string
  username: string
  skipLogin: boolean
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
      username: raw.username.toString(),
      imageUrl: makeImageLocation(raw.imageUrl),
      skipLogin: raw.skipLogin,
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
