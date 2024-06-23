import { ServiceError } from '@shared/core/errors/ServiceError'
import { StatusCode } from '@shared/core/types/StatusCode'

export class InvalidContent extends Error implements ServiceError {
  title = 'Conteúdo inválido!'
  status: number = StatusCode.BAD_REQUEST

  constructor() {
    super('Conteúdo inválido!')
  }
}
