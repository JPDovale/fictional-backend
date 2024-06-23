import { ServiceError } from '@shared/core/errors/ServiceError'
import { StatusCode } from '@shared/core/types/StatusCode'

export class SessionExpired extends Error implements ServiceError {
  title = 'Seção expirada! Faça login novamente.'
  status: number = StatusCode.NOT_FOUND

  constructor() {
    super('Seção expirada! Faça login novamente.')
  }
}
