import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const getTimelineSchema = z.object({
  projectId: z.string().trim().uuid(),
  timelineId: z.string().trim().uuid(),
})

export type GetTimelineParams = z.infer<typeof getTimelineSchema>
export const GetTimelineGateway = new ZodValidationPipe(getTimelineSchema)
