import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const createUserSchema = z.object({
  name: z.string().trim().min(3).max(255),
  email: z.string().trim().email(),
  password: z.string().trim().max(255),
  authId: z.string().trim().max(60).optional(),
  photoUrl: z.string().trim().url().optional(),
  skipLogin: z.boolean().optional(),
  verified: z.boolean().optional(),
  accessToken: z.string().trim().optional(),
})

export type CreateUserBody = z.infer<typeof createUserSchema>
export const CreateUserGateway = new ZodValidationPipe(createUserSchema)
