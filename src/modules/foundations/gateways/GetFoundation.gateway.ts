import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const getFoundationSchema = z.object({
  projectId: z.string().trim().uuid(),
})

export type GetFoundationParams = z.infer<typeof getFoundationSchema>
export const GetFoundationGateway = new ZodValidationPipe(getFoundationSchema)
