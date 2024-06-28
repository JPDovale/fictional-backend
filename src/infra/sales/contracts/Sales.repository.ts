import { Customer } from '@modules/products/valueObjects/Customer'
import { Price } from '@modules/products/valueObjects/Price'

export interface CreateCustomerProps {
  email: string
  userId: string
  name: string
}

export interface CreateCheckoutSessionProps {
  priceId: string
  customerId: string
}

export interface GetEventProps {
  secret: string | string[]
  request: Buffer | string
}

export abstract class SalesRepository {
  abstract getPrices(): Promise<Price[]>
  abstract createCustomer(props: CreateCustomerProps): Promise<Customer | null>
  abstract getCustomerById(id: string, userId: string): Promise<Customer | null>
  abstract createCheckoutSession(
    props: CreateCheckoutSessionProps,
  ): Promise<string | null>

  abstract getEvent<T>(props: GetEventProps): Promise<T>
}
