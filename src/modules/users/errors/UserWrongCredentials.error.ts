import { ServiceError } from '@shared/core/errors/ServiceError'
import { StatusCode } from '@shared/core/types/StatusCode'

export class UserWrongCredentials extends Error implements ServiceError {
  status: number = StatusCode.FORBIDDEN
  title: string = 'Email ou senha inválidos'

  constructor() {
    super('Verifique seu email e senha e tente novamente')
  }
}
