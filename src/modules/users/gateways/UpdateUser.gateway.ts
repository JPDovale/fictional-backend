import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const updateUserSchema = z.object({
  userId: z.string().trim().uuid(),
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
  authId: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9]+$/)
    .max(60)
    .optional()
    .nullable(),
  photoUrl: z.string().trim().url().optional().nullable(),
  skipLogin: z.boolean().optional(),
  verified: z.boolean().optional(),
  accessToken: z.string().trim().optional().nullable(),
})

export type UpdateUserBody = z.infer<typeof updateUserSchema>
export const UpdateUserGateway = new ZodValidationPipe(updateUserSchema)
