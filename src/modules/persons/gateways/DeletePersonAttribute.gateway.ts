import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const deletePersonAttributeSchema = z.object({
  projectId: z.string().trim().uuid(),
  personId: z.string().trim().uuid(),
  attributeId: z.string().trim().uuid(),
})

export type DeletePersonAttributeParams = z.infer<
  typeof deletePersonAttributeSchema
>
export const DeletePersonAttributeGateway = new ZodValidationPipe(
  deletePersonAttributeSchema,
)
