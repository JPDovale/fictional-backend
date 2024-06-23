import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const loginUserSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .regex(/^[a-zA-Z0-9\s._@-]+$/),
  password: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s._@-]+$/)
    .min(8)
    .max(255),
})

export type LoginUserBody = z.infer<typeof loginUserSchema>
export const LoginUserGateway = new ZodValidationPipe(loginUserSchema)
