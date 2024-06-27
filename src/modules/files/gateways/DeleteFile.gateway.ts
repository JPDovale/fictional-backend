import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const deleteFileParamsSchema = z.object({
  projectId: z.string().trim().uuid(),
  fileId: z.string().trim().uuid(),
})

export type DeleteFileParams = z.infer<typeof deleteFileParamsSchema>
export const DeleteFileParamsGateway = new ZodValidationPipe(
  deleteFileParamsSchema,
)
