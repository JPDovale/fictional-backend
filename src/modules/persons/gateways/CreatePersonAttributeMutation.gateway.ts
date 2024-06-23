import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const createPersonAttributeMutationBodySchema = z.object({
  date: z
    .string()
    .regex(/^[0-9:-]+$/)
    .trim()
    .optional(),
  importanceLevel: z.coerce.number().max(10).optional(),
  title: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s._@\-À-ÿ]+$/)
    .optional(),
})

export type CreatePersonAttributeMutationBody = z.infer<
  typeof createPersonAttributeMutationBodySchema
>
export const CreatePersonAttributeMutationBodyGateway = new ZodValidationPipe(
  createPersonAttributeMutationBodySchema,
)

const createPersonAttributeMutationParamsSchema = z.object({
  projectId: z.string().trim().uuid(),
  personId: z.string().trim().uuid(),
  attributeId: z.string().trim().uuid(),
})

export type CreatePersonAttributeMutationParams = z.infer<
  typeof createPersonAttributeMutationParamsSchema
>
export const CreatePersonAttributeMutationParamsGateway = new ZodValidationPipe(
  createPersonAttributeMutationParamsSchema,
)
