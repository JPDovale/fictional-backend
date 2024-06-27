import { Module } from '@nestjs/common'
import { StripeService } from './stripe/Stripe.service'
import { EnvModule } from '@infra/env/Env.module'
import { SalesRepository } from './contracts/Sales.repository'
import { SalesStripeRepository } from './stripe/SalesStripe.repository'

@Module({
  imports: [EnvModule],
  providers: [
    StripeService,
    {
      provide: SalesRepository,
      useClass: SalesStripeRepository,
    },
  ],
  exports: [SalesRepository],
})
export class SalesModule {}
