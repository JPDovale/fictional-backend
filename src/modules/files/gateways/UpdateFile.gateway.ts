import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const updateFileBodySchema = z.object({
  title: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s._@-\u00C0-\u00FF\u0100-\u017F\u0180-\u024F]+$/)
    .max(120)
    .optional()
    .nullable(),
  content: z.string().trim().optional().nullable(),
})

export type UpdateFileBody = z.infer<typeof updateFileBodySchema>
export const UpdateFileBodyGateway = new ZodValidationPipe(updateFileBodySchema)

const updateFileParamsSchema = z.object({
  projectId: z.string().trim().uuid(),
  fileId: z.string().trim().uuid(),
})

export type UpdateFileParams = z.infer<typeof updateFileParamsSchema>
export const UpdateFileParamsGateway = new ZodValidationPipe(
  updateFileParamsSchema,
)
