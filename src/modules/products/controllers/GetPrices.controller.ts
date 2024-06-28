import { Controller } from '@shared/core/contracts/Controller'
import {
  BadRequestException,
  Controller as ControllerNest,
  Get,
  HttpCode,
} from '@nestjs/common'
import { PresenterProps } from '@shared/core/contracts/Presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { GetPricesService } from '../services/GetPrices.service'
import { Public } from '@providers/auth/decorators/Public.decorator'

@ControllerNest('/products/prices')
export class GetPricesController implements Controller<PresenterProps> {
  constructor(private readonly getPricesService: GetPricesService) {}

  @Get()
  @HttpCode(StatusCode.OK)
  @Public()
  async handle(): Promise<PresenterProps> {
    const response = await this.getPricesService.execute()

    if (response.isLeft()) {
      throw new BadRequestException()
    }

    const { prices } = response.value

    return {
      status: StatusCode.OK,
      data: {
        prices: prices.map((price) => ({
          id: price.id,
          amount: price.amount,
        })),
      },
    }
  }
}
