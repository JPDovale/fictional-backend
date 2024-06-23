import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const getPersonSchema = z.object({
  projectId: z.string().trim().uuid(),
  personId: z.string().trim().uuid(),
})

export type GetPersonParams = z.infer<typeof getPersonSchema>
export const GetPersonGateway = new ZodValidationPipe(getPersonSchema)
