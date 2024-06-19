import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const getPersonsSchema = z.object({
  userId: z.string().trim().uuid(),
  projectId: z.string().trim().uuid(),
})

export type GetPersonsBody = z.infer<typeof getPersonsSchema>
export const GetPersonsGateway = new ZodValidationPipe(getPersonsSchema)
