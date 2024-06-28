import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const createCheckoutSessionSchema = z.object({
  priceId: z.string().trim().min(1, 'Price ID is required').max(120),
})

export type CreateCheckoutSessionBody = z.infer<
  typeof createCheckoutSessionSchema
>
export const CreateCheckoutSessionGateway = new ZodValidationPipe(
  createCheckoutSessionSchema,
)
