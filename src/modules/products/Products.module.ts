import { Module } from '@nestjs/common'
import { GetPricesService } from './services/GetPrices.service'
import { GetPricesController } from './controllers/GetPrices.controller'
import { SalesModule } from '@infra/sales/Sales.module'
import { CreateCheckoutSessionService } from './services/CreateCheckoutSession.service'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import { CreateChekoutSessionController } from './controllers/CreateCheckoutSession.controller'
import { DatabaseModule } from '@infra/database/Database.module'
import { CreateCustomerService } from './services/CreateCustomer.service'
import { WebhooksStripeController } from './controllers/WebhooksStripe.controller'
import { CheckoutCompleteService } from './services/CheckoutComplete.service'

@Module({
  imports: [SalesModule, DatabaseModule],
  controllers: [
    GetPricesController,
    CreateChekoutSessionController,
    WebhooksStripeController,
  ],
  providers: [
    GetPricesService,
    CreateCheckoutSessionService,
    CreateCustomerService,
    CheckoutCompleteService,
    ErrorPresenter,
  ],
})
export class ProductsModule {}
