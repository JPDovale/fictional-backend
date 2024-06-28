import { ServiceError } from '@shared/core/errors/ServiceError'
import { StatusCode } from '@shared/core/types/StatusCode'

export class AlreadyExistsCustomerForUser
  extends Error
  implements ServiceError
{
  title = 'Erro'
  status: number = StatusCode.CONFLICT

  constructor() {
    super('Erro ao tentar criar o usuario na base de vendas')
  }
}
