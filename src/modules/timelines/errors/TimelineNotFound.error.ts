import { ServiceError } from '@shared/core/errors/ServiceError'
import { StatusCode } from '@shared/core/types/StatusCode'

export class TimelineNotFound extends Error implements ServiceError {
  title = 'Linha de tempo não encontrado no sistema'
  status: number = StatusCode.NOT_FOUND

  constructor() {
    super('Linha de tempo não encontrado no sistema')
  }
}
