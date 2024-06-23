import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'
import { BuildBlock } from '../valueObjects/BuildBlocks'

const updateProjectBuildBlocksBodySchema = z.object({
  buildBlocks: z.array(z.nativeEnum(BuildBlock)),
})

export type UpdateProjectBuildBlocksBody = z.infer<
  typeof updateProjectBuildBlocksBodySchema
>
export const UpdateProjectBuildBlocksBodyGateway = new ZodValidationPipe(
  updateProjectBuildBlocksBodySchema,
)

const updateProjectBuildBlocksParamsSchema = z.object({
  projectId: z.string().trim().uuid(),
})

export type UpdateProjectBuildBlocksParams = z.infer<
  typeof updateProjectBuildBlocksParamsSchema
>
export const UpdateProjectBuildBlocksParamsGateway = new ZodValidationPipe(
  updateProjectBuildBlocksParamsSchema,
)
