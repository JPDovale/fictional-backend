import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const deleteEventParamsSchema = z.object({
  projectId: z.string().trim().uuid(),
  timelineId: z.string().trim().uuid(),
  eventId: z.string().trim().uuid(),
})

export type DeleteEventParams = z.infer<typeof deleteEventParamsSchema>
export const DeleteEventParamsGateway = new ZodValidationPipe(
  deleteEventParamsSchema,
)
