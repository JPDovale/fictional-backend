import { ServiceError } from '@shared/core/errors/ServiceError'
import { StatusCode } from '@shared/core/types/StatusCode'

export class ProjectActionBlocked extends Error implements ServiceError {
  title = 'Ação não permitida'
  status: number = StatusCode.FORBIDDEN

  constructor() {
    super('A ação no projeto foi bloqueada por falta de permissão')
  }
}
