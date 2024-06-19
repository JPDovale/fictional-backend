import { ServiceError } from '@shared/core/errors/ServiceError'
import { StatusCode } from '@shared/core/types/StatusCode'

export class FileNotFound extends Error implements ServiceError {
  title = 'Arquivo não encontrado no sistema'
  status: number = StatusCode.NOT_FOUND

  constructor() {
    super('Arquivo não encontrado no sistema')
  }
}
