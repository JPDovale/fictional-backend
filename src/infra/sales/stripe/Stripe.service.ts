import { EnvService } from '@infra/env/Env.service'
import { Injectable } from '@nestjs/common'
import Stripe from 'stripe'

@Injectable()
export class StripeService extends Stripe {
  constructor(env: EnvService) {
    super(env.get('STRIPE_API_KEY'), {
      apiVersion: '2024-06-20',
      typescript: true,
      appInfo: {
        name: 'Fictional',
        version: '1.0.0',
      },
    })
  }
}
