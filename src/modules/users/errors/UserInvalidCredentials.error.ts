import { ServiceError } from '@shared/core/errors/ServiceError'
import { StatusCode } from '@shared/core/types/StatusCode'

export class UserInvalidCredentials extends Error implements ServiceError {
  status: number = StatusCode.FORBIDDEN
  title: string = 'Não foi possivel autenticar o usuário'

  constructor() {
    super('Não foi possivel autenticar o usuário')
  }
}
