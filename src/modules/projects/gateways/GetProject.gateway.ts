import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const getProjectSchema = z.object({
  projectId: z.string().trim().uuid(),
})

export type GetProjectParams = z.infer<typeof getProjectSchema>
export const GetProjectGateway = new ZodValidationPipe(getProjectSchema)
