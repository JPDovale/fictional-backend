import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'
import { PersonType } from '../entities/types'

const updatePersonSchema = z.object({
  history: z.string().trim().optional().nullable(),
  name: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s._@-]+$/)
    .max(255)
    .optional()
    .nullable(),
  image: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s._@-]+$/)
    .optional()
    .nullable(),
  birthDate: z
    .string()
    .trim()
    .regex(/^[0-9:-]+$/)
    .optional()
    .nullable(),
  deathDate: z
    .string()
    .trim()
    .regex(/^[0-9:-]+$/)
    .optional()
    .nullable(),
  type: z.nativeEnum(PersonType).optional(),
  motherId: z.string().trim().uuid().optional().nullable(),
  fatherId: z.string().trim().uuid().optional().nullable(),
})

export type UpdatePersonBody = z.infer<typeof updatePersonSchema>
export const UpdatePersonBodyGateway = new ZodValidationPipe(updatePersonSchema)

const updatePersonParamsSchema = z.object({
  personId: z.string().trim().uuid(),
  projectId: z.string().trim().uuid(),
})

export type UpdatePersonParams = z.infer<typeof updatePersonParamsSchema>
export const UpdatePersonParamsGateway = new ZodValidationPipe(
  updatePersonParamsSchema,
)
