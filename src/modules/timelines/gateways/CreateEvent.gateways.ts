import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const createEventBodySchema = z.object({
  title: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s._@\-À-ÿ]+$/),
  importanceLevel: z.coerce.number().max(10).min(0),
  event: z.string(),
  date: z
    .string()
    .trim()
    .regex(/^[0-9:-]+$/),
})

export type CreateEventBody = z.infer<typeof createEventBodySchema>
export const CreateEventBodyGateway = new ZodValidationPipe(
  createEventBodySchema,
)

const createEventParamsSchema = z.object({
  projectId: z.string().trim().uuid(),
  timelineId: z.string().trim().uuid(),
})

export type CreateEventParams = z.infer<typeof createEventParamsSchema>
export const CreateEventParamsGateway = new ZodValidationPipe(
  createEventParamsSchema,
)
