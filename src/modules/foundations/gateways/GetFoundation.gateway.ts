import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const getFoundationSchema = z.object({
  userId: z.string().trim().uuid(),
  projectId: z.string().trim().uuid(),
})

export type GetFoundationBody = z.infer<typeof getFoundationSchema>
export const GetFoundationGateway = new ZodValidationPipe(getFoundationSchema)
