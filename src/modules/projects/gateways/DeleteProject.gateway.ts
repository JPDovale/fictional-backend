import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const deleteProjectSchema = z.object({
  userId: z.string().trim().uuid(),
  projectId: z.string().trim().uuid(),
})

export type DeleteProjectBody = z.infer<typeof deleteProjectSchema>
export const DeleteProjectGateway = new ZodValidationPipe(deleteProjectSchema)
