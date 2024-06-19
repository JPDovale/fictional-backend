import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const deletePersonAttributeSchema = z.object({
  userId: z.string().trim().uuid(),
  projectId: z.string().trim().uuid(),
  personId: z.string().trim().uuid(),
  attributeId: z.string().trim().uuid(),
})

export type DeletePersonAttributeBody = z.infer<
  typeof deletePersonAttributeSchema
>
export const DeletePersonAttributeGateway = new ZodValidationPipe(
  deletePersonAttributeSchema,
)
