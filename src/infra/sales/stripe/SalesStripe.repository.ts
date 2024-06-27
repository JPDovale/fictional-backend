import { Injectable } from '@nestjs/common'
import { SalesRepository } from '../contracts/Sales.repository'
import { StripeService } from './Stripe.service'

@Injectable()
export class SalesStripeRepository implements SalesRepository {
  constructor(private readonly stripe: StripeService) {}

  async getPrices(): Promise<string[]> {
    const prices = await this.stripe.prices.list()
    console.log(prices)

    return []
  }
}
