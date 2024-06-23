import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const updatePersonAttributeMutationBodySchema = z.object({
  date: z
    .string()
    .regex(/^[0-9:-]+$/)
    .trim()
    .optional()
    .nullable(),
  importanceLevel: z.coerce.number().max(10).optional(),
  title: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s._@-]+$/)
    .optional()
    .nullable(),
})

export type UpdatePersonAttributeMutationBody = z.infer<
  typeof updatePersonAttributeMutationBodySchema
>
export const UpdatePersonAttributeMutationBodyGateway = new ZodValidationPipe(
  updatePersonAttributeMutationBodySchema,
)

const updatePersonAttributeMutationParamsSchema = z.object({
  projectId: z.string().trim().uuid(),
  personId: z.string().trim().uuid(),
  mutationId: z.string().trim().uuid(),
  attributeId: z.string().trim().uuid(),
})

export type UpdatePersonAttributeMutationParams = z.infer<
  typeof updatePersonAttributeMutationParamsSchema
>
export const UpdatePersonAttributeMutationParamsGateway = new ZodValidationPipe(
  updatePersonAttributeMutationParamsSchema,
)
