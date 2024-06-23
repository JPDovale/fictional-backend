import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const getFileSchema = z.object({
  projectId: z.string().trim().uuid(),
  fileId: z.string().trim().uuid(),
})

export type GetFileParams = z.infer<typeof getFileSchema>
export const GetFileGateway = new ZodValidationPipe(getFileSchema)
