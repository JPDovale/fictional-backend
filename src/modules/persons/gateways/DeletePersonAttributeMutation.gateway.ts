import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const deletePersonAttributeMutationSchema = z.object({
  userId: z.string().trim().uuid(),
  projectId: z.string().trim().uuid(),
  personId: z.string().trim().uuid(),
  mutationId: z.string().trim().uuid(),
  attributeId: z.string().trim().uuid(),
})

export type DeletePersonAttributeMutationBody = z.infer<
  typeof deletePersonAttributeMutationSchema
>
export const DeletePersonAttributeMutationGateway = new ZodValidationPipe(
  deletePersonAttributeMutationSchema,
)
