import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const getPersonAttributeSchema = z.object({
  projectId: z.string().trim().uuid(),
  personId: z.string().trim().uuid(),
  attributeId: z.string().trim().uuid(),
})

export type GetPersonAttributeParams = z.infer<typeof getPersonAttributeSchema>
export const GetPersonAttributeGateway = new ZodValidationPipe(
  getPersonAttributeSchema,
)
