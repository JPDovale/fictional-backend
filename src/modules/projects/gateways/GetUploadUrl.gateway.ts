import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const getUploadUrlSchema = z.object({
  filename: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s._@-\u00C0-\u00FF\u0100-\u017F\u0180-\u024F]+$/)
    .max(255),
  contentType: z
    .string()
    .trim()
    .regex(/^image\/(png|jpe?g|webp|gif|svg)$/),
})

export type GetUploadUrlBody = z.infer<typeof getUploadUrlSchema>
export const GetUploadUrlGateway = new ZodValidationPipe(getUploadUrlSchema)
