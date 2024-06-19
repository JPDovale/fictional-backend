import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const deletePersonSchema = z.object({
  userId: z.string().trim().uuid(),
  projectId: z.string().trim().uuid(),
  personId: z.string().trim().uuid(),
})

export type DeletePersonBody = z.infer<typeof deletePersonSchema>
export const DeletePersonGateway = new ZodValidationPipe(deletePersonSchema)
