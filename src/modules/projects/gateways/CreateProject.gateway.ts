import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'
import { BuildBlock } from '../valueObjects/BuildBlocks'

const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s._@\-À-ÿ]+$/)
    .min(3)
    .max(255),
  image: z
    .string()
    .trim()
    .max(512)
    .regex(/^[a-zA-Z0-9\s._@\-À-ÿ]+$/)
    .optional(),
  buildBlocks: z.array(z.nativeEnum(BuildBlock)),
})

export type CreateProjectBody = z.infer<typeof createProjectSchema>
export const CreateProjectGateway = new ZodValidationPipe(createProjectSchema)
