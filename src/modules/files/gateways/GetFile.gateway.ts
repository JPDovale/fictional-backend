import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const getFileSchema = z.object({
  userId: z.string().trim().uuid(),
  projectId: z.string().trim().uuid(),
  fileId: z.string().trim().uuid(),
})

export type GetFileBody = z.infer<typeof getFileSchema>
export const GetFileGateway = new ZodValidationPipe(getFileSchema)
