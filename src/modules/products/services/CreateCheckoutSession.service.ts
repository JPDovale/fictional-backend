import { UserNotFound } from '@modules/users/errors/UserNotFound.error'
import { Service } from '@shared/core/contracts/Service'
import { Either, left, right } from '@shared/core/errors/Either'
import { UsersRepository } from '@modules/users/repositories/Users.repository'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { AlreadyExistsCustomerForUser } from '../errors/AlreadyExistsCustomerForUser.error'
import { SalesRepository } from '@infra/sales/contracts/Sales.repository'
import { CreateCustomerService } from './CreateCustomer.service'
import { SubscriptionStatus } from '../entities/Subscription'
import { AlreadyExistsSubscriptionForUser } from '../errors/AlreadyExistsSubscriptionForUser.error'

type Request = {
  userId: string
  priceId: string
}

type PossibleErrors = UserNotFound | AlreadyExistsCustomerForUser

type Response = {
  sessionId: string
}

@Injectable()
export class CreateCheckoutSessionService
  implements Service<Request, PossibleErrors, Response>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly salesRepository: SalesRepository,
    private readonly createCustomerService: CreateCustomerService,
  ) {}

  async execute({
    userId,
    priceId,
  }: Request): Promise<Either<PossibleErrors, Response>> {
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      return left(new UserNotFound())
    }

    if (user.subscription?.status === SubscriptionStatus.PAYED) {
      return left(new AlreadyExistsSubscriptionForUser())
    }

    let customerId = user.customerId

    if (!customerId) {
      const result = await this.createCustomerService.execute({
        userId,
      })

      if (result.isLeft()) {
        return left(result.value)
      }

      const { customer } = result.value
      user.customerId = customer.id
      customerId = customer.id
    }

    const sessionId = await this.salesRepository.createCheckoutSession({
      priceId,
      customerId,
    })

    if (!sessionId) {
      throw new InternalServerErrorException()
    }

    return right({ sessionId })
  }
}
