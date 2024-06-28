import { Service } from '@shared/core/contracts/Service'
import { Either, right } from '@shared/core/errors/Either'
import { Injectable } from '@nestjs/common'
import { SalesRepository } from '@infra/sales/contracts/Sales.repository'
import { Price } from '../valueObjects/Price'

type Response = {
  prices: Price[]
}

@Injectable()
export class GetPricesService implements Service<undefined, null, Response> {
  constructor(private readonly salesRepository: SalesRepository) {}

  async execute(): Promise<Either<null, Response>> {
    const prices = await this.salesRepository.getPrices()

    return right({ prices })
  }
}
