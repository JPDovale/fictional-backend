import { Injectable } from '@nestjs/common'
import {
  CreateCheckoutSessionProps,
  CreateCustomerProps,
  GetEventProps,
  SalesRepository,
} from '../contracts/Sales.repository'
import { StripeService } from './Stripe.service'
import { Price } from '@modules/products/valueObjects/Price'
import { Customer } from '@modules/products/valueObjects/Customer'
import { EnvService } from '@infra/env/Env.service'
import Stripe from 'stripe'

@Injectable()
export class SalesStripeRepository implements SalesRepository {
  constructor(
    private readonly stripe: StripeService,
    private readonly env: EnvService,
  ) {}

  async getPrices(): Promise<Price[]> {
    const pricesData = await this.stripe.prices.list()

    const prices = pricesData.data.map((price) =>
      Price.create({
        id: price.id,
        amount: price.unit_amount!,
      }),
    )

    return prices
  }

  async createCustomer({
    email,
    userId,
    name,
  }: CreateCustomerProps): Promise<Customer | null> {
    try {
      const response = await this.stripe.customers.create({
        email,
        name,
        metadata: {
          userId,
        },
      })

      const customer = Customer.create({
        email,
        name,
        userId,
        id: response.id,
      })

      return customer
    } catch (err) {
      console.error(err)
      return null
    }
  }

  async getCustomerById(id: string, userId: string): Promise<Customer | null> {
    try {
      const response = await this.stripe.customers.search({
        query: `id:'${id}' AND metadata['userId']:'${userId}'`,
      })

      if (!response.data[0]) return null

      const customerData = response.data[0]

      const customer = Customer.create({
        email: customerData.email!,
        name: customerData.name!,
        userId,
        id: customerData.id,
      })

      return customer
    } catch (err) {
      console.error(err)
      return null
    }
  }

  async createCheckoutSession({
    customerId,
    priceId,
  }: CreateCheckoutSessionProps): Promise<string | null> {
    try {
      const response = await this.stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        allow_promotion_codes: true,
        success_url: this.env.get('STRIPE_SUCCESS_URL'),
        cancel_url: this.env.get('STRIPE_CANCEL_URL'),
      })

      return response.id
    } catch (err) {
      console.error(err)
      return null
    }
  }

  async getEvent<T = Stripe.Event>({
    request,
    secret,
  }: GetEventProps): Promise<T> {
    const event = this.stripe.webhooks.constructEvent(
      request,
      secret,
      this.env.get('STRIPE_WEBHOOK_SECRET'),
    )

    return event as T
  }
}
