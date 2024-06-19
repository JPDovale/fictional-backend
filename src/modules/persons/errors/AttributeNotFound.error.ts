import { ServiceError } from '@shared/core/errors/ServiceError'
import { StatusCode } from '@shared/core/types/StatusCode'

export class AttributeNotFound extends Error implements ServiceError {
  title = 'Atributo não encontrado no sistema'
  status: number = StatusCode.NOT_FOUND

  constructor() {
    super('Atributo não encontrado no sistema')
  }
}
