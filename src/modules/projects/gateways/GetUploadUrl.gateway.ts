import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const getUploadUrlSchema = z.object({
  filename: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s._@\-À-ÿ]+$/)
    .max(255),
  contentType: z
    .string()
    .trim()
    .regex(/^image\/(png|jpe?g|webp|gif|svg)$/),
})

export type GetUploadUrlBody = z.infer<typeof getUploadUrlSchema>
export const GetUploadUrlGateway = new ZodValidationPipe(getUploadUrlSchema)
