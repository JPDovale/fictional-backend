import { ServiceError } from '@shared/core/errors/ServiceError'
import { StatusCode } from '@shared/core/types/StatusCode'

export class AlreadyExistsSubscriptionForUser
  extends Error
  implements ServiceError
{
  title = 'O usuário já tem um plano ativo'
  status: number = StatusCode.CONFLICT

  constructor() {
    super(
      'Existe uma assinatura ativa para este usuário! Cencele a assinatura e tente novamente.',
    )
  }
}
