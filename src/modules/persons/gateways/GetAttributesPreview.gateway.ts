import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const getAttributesPreviewSchema = z.object({
  userId: z.string().trim().uuid(),
  projectId: z.string().trim().uuid(),
})

export type GetAttributesPreviewBody = z.infer<
  typeof getAttributesPreviewSchema
>
export const GetAttributesPreviewGateway = new ZodValidationPipe(
  getAttributesPreviewSchema,
)
