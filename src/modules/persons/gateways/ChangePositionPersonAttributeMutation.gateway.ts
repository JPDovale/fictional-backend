import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const changePositionPersonAttributeMutationBodySchema = z.object({
  direction: z.enum(['UP', 'DOWN', 'TOP', 'BOTTOM']),
})

export type ChangePositionPersonAttributeMutationBody = z.infer<
  typeof changePositionPersonAttributeMutationBodySchema
>
export const ChangePositionPersonAttributeMutationBodyGateway =
  new ZodValidationPipe(changePositionPersonAttributeMutationBodySchema)

const changePositionPersonAttributeMutationParamsSchema = z.object({
  projectId: z.string().trim().uuid(),
  personId: z.string().trim().uuid(),
  mutationId: z.string().trim().uuid(),
  attributeId: z.string().trim().uuid(),
})
export type ChangePositionPersonAttributeMutationParams = z.infer<
  typeof changePositionPersonAttributeMutationParamsSchema
>
export const ChangePositionPersonAttributeMutationParamsGateway =
  new ZodValidationPipe(changePositionPersonAttributeMutationParamsSchema)
