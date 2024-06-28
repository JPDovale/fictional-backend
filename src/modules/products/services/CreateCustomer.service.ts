import { UserNotFound } from '@modules/users/errors/UserNotFound.error'
import { Service } from '@shared/core/contracts/Service'
import { Either, left, right } from '@shared/core/errors/Either'
import { UsersRepository } from '@modules/users/repositories/Users.repository'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Customer } from '../valueObjects/Customer'
import { AlreadyExistsCustomerForUser } from '../errors/AlreadyExistsCustomerForUser.error'
import { SalesRepository } from '@infra/sales/contracts/Sales.repository'

type Request = {
  userId: string
}

type PossibleErrors = UserNotFound | AlreadyExistsCustomerForUser

type Response = {
  customer: Customer
}

@Injectable()
export class CreateCustomerService
  implements Service<Request, PossibleErrors, Response>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly salesRepository: SalesRepository,
  ) {}

  async execute({
    userId,
  }: Request): Promise<Either<PossibleErrors, Response>> {
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      return left(new UserNotFound())
    }

    if (user.customerId) {
      return left(new AlreadyExistsCustomerForUser())
    }

    const customer = await this.salesRepository.createCustomer({
      userId: user.id.toString(),
      name: user.name,
      email: user.email,
    })

    if (!customer) {
      throw new InternalServerErrorException()
    }

    user.customerId = customer.id
    await this.usersRepository.save(user)

    return right({ customer })
  }
}
