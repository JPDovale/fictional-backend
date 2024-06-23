import { Injectable } from '@nestjs/common'
import { Presenter, PresenterProps } from '@shared/core/contracts/Presenter'
import { StatusCode } from '@shared/core/types/StatusCode'

@Injectable()
export class EmptyPresenter implements Presenter<null | undefined> {
  presentMany(): PresenterProps<unknown> {
    return {
      status: StatusCode.NO_CONTENT,
      data: null,
    }
  }

  present(): PresenterProps {
    return {
      status: StatusCode.NO_CONTENT,
      data: null,
    }
  }
}
