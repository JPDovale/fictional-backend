import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const deleteProjectSchema = z.object({
  projectId: z.string().trim().uuid(),
})

export type DeleteProjectParams = z.infer<typeof deleteProjectSchema>
export const DeleteProjectGateway = new ZodValidationPipe(deleteProjectSchema)
