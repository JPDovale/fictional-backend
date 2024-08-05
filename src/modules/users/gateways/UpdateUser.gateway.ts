import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const updateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s._@\-À-ÿ]+$/)
    .max(255)
    .optional(),
  email: z
    .string()
    .trim()
    .email()
    .regex(/^[a-zA-Z0-9\s._@\-À-ÿ]+$/)
    .optional(),
  imageUrl: z
    .string()
    .trim()
    .max(512)
    .regex(/^[a-zA-Z0-9\s._@\-À-ÿ]+$/)
    .optional()
    .nullable(),
})

export type UpdateUserBody = z.infer<typeof updateUserSchema>
export const UpdateUserGateway = new ZodValidationPipe(updateUserSchema)
