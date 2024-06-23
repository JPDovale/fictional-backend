import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const getAttributesPreviewSchema = z.object({
  projectId: z.string().trim().uuid(),
})

export type GetAttributesPreviewParams = z.infer<
  typeof getAttributesPreviewSchema
>
export const GetAttributesPreviewGateway = new ZodValidationPipe(
  getAttributesPreviewSchema,
)
