import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const createFileBodySchema = z.object({
  folderId: z.string().trim().uuid().optional(),
})

export type CreateFileBody = z.infer<typeof createFileBodySchema>
export const CreateFileBodyGateway = new ZodValidationPipe(createFileBodySchema)

const createFileParamsSchema = z.object({
  projectId: z.string().trim().uuid(),
})

export type CreateFileParams = z.infer<typeof createFileParamsSchema>
export const CreateFileParamsGateway = new ZodValidationPipe(
  createFileParamsSchema,
)
