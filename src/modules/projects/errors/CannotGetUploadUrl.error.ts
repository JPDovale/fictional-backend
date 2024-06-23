import { ServiceError } from '@shared/core/errors/ServiceError'
import { StatusCode } from '@shared/core/types/StatusCode'

export class CannotGetUploadUrl extends Error implements ServiceError {
  title = 'Erro interno!'
  status: number = StatusCode.INTERNAL_SERVER_ERROR

  constructor() {
    super('Não foi possivel criar uma url de upload')
  }
}
