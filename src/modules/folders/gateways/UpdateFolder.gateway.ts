import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const updateFolderBodySchema = z.object({
  name: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s._@\-À-ÿ]+$/)
    .max(255)
    .optional()
    .nullable(),
})

export type UpdateFolderBody = z.infer<typeof updateFolderBodySchema>
export const UpdateFolderBodyGateway = new ZodValidationPipe(
  updateFolderBodySchema,
)

const updateFolderParamsSchema = z.object({
  projectId: z.string().trim().uuid(),
  folderId: z.string().trim().uuid(),
})

export type UpdateFolderParams = z.infer<typeof updateFolderParamsSchema>
export const UpdateFolderParamsGateway = new ZodValidationPipe(
  updateFolderParamsSchema,
)
