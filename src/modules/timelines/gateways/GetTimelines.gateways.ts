import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const getTimelinesSchema = z.object({
  userId: z.string().trim().uuid(),
  projectId: z.string().trim().uuid(),
})

export type GetTimelinesBody = z.infer<typeof getTimelinesSchema>
export const GetTimelinesGateway = new ZodValidationPipe(getTimelinesSchema)
