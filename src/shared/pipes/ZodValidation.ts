import { ZodError, ZodSchema } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { StatusCode } from '@shared/core/types/StatusCode'
import { BadRequestException, PipeTransform } from '@nestjs/common'

/**
 * @class ZodValidationPipe - A validation pipe
 * It will validate the data request on application.
 */
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value)
    } catch (err) {
      if (err instanceof ZodError) {
        throw new BadRequestException({
          details: { errors: fromZodError(err) },
          message: 'Cant be validate received data',
          title: 'Validation error',
          status: StatusCode.BAD_REQUEST,
        })
      }

      throw new BadRequestException('Cant be validate received data')
    }
  }
}
