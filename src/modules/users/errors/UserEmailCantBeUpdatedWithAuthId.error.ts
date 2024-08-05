import { ServiceError } from '@shared/core/errors/ServiceError'
import { StatusCode } from '@shared/core/types/StatusCode'

export class UserEmailCantBeUpdaterWithAuthId
  extends Error
  implements ServiceError
{
  title = 'Email do usuário não pode ser auterado para login social'
  status: number = StatusCode.CONFLICT

  constructor() {
    super('Email do usuário não pode ser auterado para login social')
  }
}
