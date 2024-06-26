import { ServiceError } from '@shared/core/errors/ServiceError'
import { StatusCode } from '@shared/core/types/StatusCode'

export class FolderNotFound extends Error implements ServiceError {
  title = 'Pasta não encontrada no sistema'
  status: number = StatusCode.NOT_FOUND

  constructor() {
    super('Pasta não encontrado no sistema')
  }
}
