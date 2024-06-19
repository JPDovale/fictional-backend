import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'
import { BuildBlock } from '../valueObjects/BuildBlocks'

const updateProjectBuildBlocksSchema = z.object({
  userId: z.string().trim().uuid(),
  projectId: z.string().trim().uuid(),
  buildBlocks: z.array(z.nativeEnum(BuildBlock)),
})

export type UpdateProjectBuildBlocksBody = z.infer<
  typeof updateProjectBuildBlocksSchema
>
export const UpdateProjectBuildBlocksGateway = new ZodValidationPipe(
  updateProjectBuildBlocksSchema,
)
