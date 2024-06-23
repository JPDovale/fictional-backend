import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const deletePersonSchema = z.object({
  projectId: z.string().trim().uuid(),
  personId: z.string().trim().uuid(),
})

export type DeletePersonParams = z.infer<typeof deletePersonSchema>
export const DeletePersonGateway = new ZodValidationPipe(deletePersonSchema)
