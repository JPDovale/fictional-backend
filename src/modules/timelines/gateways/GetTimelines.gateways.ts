import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const getTimelinesSchema = z.object({
  projectId: z.string().trim().uuid(),
})

export type GetTimelinesParams = z.infer<typeof getTimelinesSchema>
export const GetTimelinesGateway = new ZodValidationPipe(getTimelinesSchema)
