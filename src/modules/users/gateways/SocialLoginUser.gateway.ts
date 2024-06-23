import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const SocialLoginUserSchema = z.object({
  token: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/),
})

export type SocialLoginUserBody = z.infer<typeof SocialLoginUserSchema>
export const SocialLoginUserGateway = new ZodValidationPipe(
  SocialLoginUserSchema,
)
