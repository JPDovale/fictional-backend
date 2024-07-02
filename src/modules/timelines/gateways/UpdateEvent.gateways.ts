import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const updateEventBodySchema = z.object({
  title: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s._@\-À-ÿ]+$/)
    .optional(),
  importanceLevel: z.coerce.number().max(10).min(0).optional(),
  event: z.string().optional(),
  date: z
    .string()
    .trim()
    .regex(/^[0-9:-]+$/)
    .optional(),
})

export type UpdateEventBody = z.infer<typeof updateEventBodySchema>
export const UpdateEventBodyGateway = new ZodValidationPipe(
  updateEventBodySchema,
)

const updateEventParamsSchema = z.object({
  projectId: z.string().trim().uuid(),
  timelineId: z.string().trim().uuid(),
  eventId: z.string().trim().uuid(),
})

export type UpdateEventParams = z.infer<typeof updateEventParamsSchema>
export const UpdateEventParamsGateway = new ZodValidationPipe(
  updateEventParamsSchema,
)
