import { Controller } from '@shared/core/contracts/Controller'
import {
  BadRequestException,
  Controller as ControllerNest,
  HttpCode,
  Post,
  Req,
} from '@nestjs/common'
import { PresenterProps } from '@shared/core/contracts/Presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { Public } from '@providers/auth/decorators/Public.decorator'
import { Request } from 'express'
import { SalesRepository } from '@infra/sales/contracts/Sales.repository'
import Stripe from 'stripe'
import { CheckoutCompleteService } from '../services/CheckoutComplete.service'

@ControllerNest('/stripe/webhooks')
export class WebhooksStripeController implements Controller<PresenterProps> {
  constructor(
    private readonly salesRepository: SalesRepository,
    private readonly checkoutCompleteService: CheckoutCompleteService,
  ) {}

  @Post()
  @HttpCode(StatusCode.OK)
  @Public()
  async handle(@Req() req: Request): Promise<PresenterProps> {
    const secret = req.headers['stripe-signature']

    if (!secret) {
      throw new BadRequestException()
    }

    const event = await this.salesRepository.getEvent<Stripe.Event>({
      secret,
      request: req.body,
    })

    switch (event.type) {
      case 'checkout.session.completed': {
        const checkout = event.data.object as Stripe.Checkout.Session

        const customerId = checkout.customer?.toString()
        const subscriptionId =
          checkout.subscription?.toString() ??
          checkout.payment_intent?.toString()

        if (!customerId || !subscriptionId) {
          throw new BadRequestException()
        }

        await this.checkoutCompleteService.execute({
          customerId,
          subscriptionId,
          priceId: '',
        })
        break
      }
    }

    return {
      status: StatusCode.OK,
      received: true,
    }
  }
}
