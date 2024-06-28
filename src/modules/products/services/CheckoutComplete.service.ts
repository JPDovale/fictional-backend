import { UserNotFound } from '@modules/users/errors/UserNotFound.error'
import { Service } from '@shared/core/contracts/Service'
import { Either, left, right } from '@shared/core/errors/Either'
import { UsersRepository } from '@modules/users/repositories/Users.repository'
import { Injectable } from '@nestjs/common'
import { AlreadyExistsCustomerForUser } from '../errors/AlreadyExistsCustomerForUser.error'
import { Subscription, SubscriptionStatus } from '../entities/Subscription'

type Request = {
  customerId: string
  priceId: string
  subscriptionId: string
}

type PossibleErrors = UserNotFound | AlreadyExistsCustomerForUser

type Response = null

@Injectable()
export class CheckoutCompleteService
  implements Service<Request, PossibleErrors, Response>
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    customerId,
    priceId,
    subscriptionId,
  }: Request): Promise<Either<PossibleErrors, Response>> {
    const user = await this.usersRepository.findByCustomerId(customerId)
    if (!user) {
      return left(new UserNotFound())
    }

    if (!user.subscription) {
      const subscription = Subscription.create({
        status: SubscriptionStatus.PAYED,
        priceId,
        subscriptionId,
        userId: user.id,
      })

      user.subscription = subscription
      await this.usersRepository.createSubscription(subscription)
    }

    if (
      user.subscription &&
      user.subscription.status !== SubscriptionStatus.PAYED
    ) {
      user.subscription.status = SubscriptionStatus.PAYED
      user.subscription.priceId = priceId
      user.subscription.subscriptionId = subscriptionId

      await this.usersRepository.saveSubscription(user.subscription)
    }

    await this.usersRepository.save(user)

    return right(null)
  }
}
