import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const createFolderBodySchema = z.object({
  parentId: z.string().trim().uuid().optional(),
})

export type CreateFolderBody = z.infer<typeof createFolderBodySchema>
export const CreateFolderBodyGateway = new ZodValidationPipe(
  createFolderBodySchema,
)

const createFolderParamsSchema = z.object({
  projectId: z.string().trim().uuid(),
})

export type CreateFolderParams = z.infer<typeof createFolderParamsSchema>
export const CreateFolderParamsGateway = new ZodValidationPipe(
  createFolderParamsSchema,
)
