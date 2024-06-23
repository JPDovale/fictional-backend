import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const updateFoundationSchema = z.object({
  foundation: z.string().trim().nullable().optional(),
  whatHappens: z.string().trim().nullable().optional(),
  whyHappens: z.string().trim().nullable().optional(),
  whereHappens: z.string().trim().nullable().optional(),
  whoHappens: z.string().trim().nullable().optional(),
})

export type UpdateFoundationBody = z.infer<typeof updateFoundationSchema>
export const UpdateFoundationBodyGateway = new ZodValidationPipe(
  updateFoundationSchema,
)

const updateFoundationParamsSchema = z.object({
  projectId: z.string().trim().uuid(),
  foundationId: z.string().trim().uuid(),
})

export type UpdateFoundationParams = z.infer<
  typeof updateFoundationParamsSchema
>
export const UpdateFoundationParamsGateway = new ZodValidationPipe(
  updateFoundationParamsSchema,
)
