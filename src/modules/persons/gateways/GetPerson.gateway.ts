import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const getPersonSchema = z.object({
  userId: z.string().trim().uuid(),
  projectId: z.string().trim().uuid(),
  personId: z.string().trim().uuid(),
})

export type GetPersonBody = z.infer<typeof getPersonSchema>
export const GetPersonGateway = new ZodValidationPipe(getPersonSchema)
