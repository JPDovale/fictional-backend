import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s._@\-À-ÿ]+$/)
    .min(3)
    .max(255),
  email: z
    .string()
    .trim()
    .email()
    .regex(/^[a-zA-Z0-9\s._@\-À-ÿ]+$/),
  password: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s._@\-À-ÿ]+$/)
    .min(8)
    .max(255),
})

export type CreateUserBody = z.infer<typeof createUserSchema>
export const CreateUserGateway = new ZodValidationPipe(createUserSchema)
