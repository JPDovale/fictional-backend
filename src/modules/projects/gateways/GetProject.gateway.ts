import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const getProjectSchema = z.object({
  userId: z.string().trim().uuid(),
  projectId: z.string().trim().uuid(),
})

export type GetProjectBody = z.infer<typeof getProjectSchema>
export const GetProjectGateway = new ZodValidationPipe(getProjectSchema)
