import { ServiceError } from '@shared/core/errors/ServiceError'
import { StatusCode } from '@shared/core/types/StatusCode'

export class FoundationNotFound extends Error implements ServiceError {
  title = 'Fundação do projeto não encontrada no sistema'
  status: number = StatusCode.NOT_FOUND

  constructor() {
    super('Fundação do projeto nẽo encontrada no sistema')
  }
}
