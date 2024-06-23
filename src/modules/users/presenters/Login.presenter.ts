import { Presenter, PresenterProps } from '@shared/core/contracts/Presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { Injectable } from '@nestjs/common'

export interface LoginResponse {
  refreshToken: string
  accessToken: string
}

export interface LoginPresented {
  refreshToken: string
  accessToken: string
}

export interface LoginsPresented {
  refreshToken: string
  accessToken: string
}

@Injectable()
export class LoginPresenter
  implements Presenter<LoginResponse, LoginPresented, LoginsPresented>
{
  present(
    raw: LoginResponse,
    status: StatusCode = StatusCode.OK,
  ): PresenterProps<LoginPresented> {
    return {
      status,
      data: {
        refreshToken: raw.refreshToken,
        accessToken: raw.accessToken,
      },
    }
  }

  presentMany(_raws: LoginResponse[]): PresenterProps<LoginsPresented> {
    throw new Error('Method not implemented.')
  }
}
