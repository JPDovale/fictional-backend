import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const getUserSchema = z.object({
  id: z.string().trim().uuid(),
})

export type GetUserBody = z.infer<typeof getUserSchema>
export const GetUserGateway = new ZodValidationPipe(getUserSchema)
