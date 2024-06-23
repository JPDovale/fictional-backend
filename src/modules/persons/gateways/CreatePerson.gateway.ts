import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'
import { PersonType } from '../entities/types'

const createPersonBodySchema = z.object({
  name: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s._@-]+$/)
    .max(255)
    .optional(),
  image: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s._@-]+$/)
    .optional(),
  birthDate: z
    .string()
    .trim()
    .regex(/^[0-9:-]+$/)
    .optional(),
  deathDate: z
    .string()
    .trim()
    .regex(/^[0-9:-]+$/)
    .optional(),
  type: z.nativeEnum(PersonType),
  motherId: z.string().trim().uuid().optional(),
  fatherId: z.string().trim().uuid().optional(),
})

export type CreatePersonBody = z.infer<typeof createPersonBodySchema>
export const CreatePersonBodyGateway = new ZodValidationPipe(
  createPersonBodySchema,
)

const createPersonParamsSchema = z.object({
  projectId: z.string().trim().uuid(),
})

export type CreatePersonParams = z.infer<typeof createPersonParamsSchema>
export const CreatePersonParamsGateway = new ZodValidationPipe(
  createPersonParamsSchema,
)
