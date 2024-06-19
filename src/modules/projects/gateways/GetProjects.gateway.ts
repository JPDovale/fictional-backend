import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const getProjectsSchema = z.object({
  userId: z.string().trim().uuid(),
})

export type GetProjectsBody = z.infer<typeof getProjectsSchema>
export const GetProjectsGateway = new ZodValidationPipe(getProjectsSchema)
