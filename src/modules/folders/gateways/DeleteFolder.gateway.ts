import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const deleteFolderParamsSchema = z.object({
  projectId: z.string().trim().uuid(),
  folderId: z.string().trim().uuid(),
})

export type DeleteFolderParams = z.infer<typeof deleteFolderParamsSchema>
export const DeleteFolderParamsGateway = new ZodValidationPipe(
  deleteFolderParamsSchema,
)
