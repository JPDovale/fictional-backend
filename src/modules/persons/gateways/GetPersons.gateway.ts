import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const getPersonsSchema = z.object({
  projectId: z.string().trim().uuid(),
})

export type GetPersonsParams = z.infer<typeof getPersonsSchema>
export const GetPersonsGateway = new ZodValidationPipe(getPersonsSchema)
