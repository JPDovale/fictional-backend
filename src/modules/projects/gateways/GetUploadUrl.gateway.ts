import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'

const getUploadUrlSchema = z.object({
  filename: z
    .string()
    .trim()
    .transform((text) =>
      text
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[^a-zA-Z0-9]/g, '')
        .trim(),
    ),
  contentType: z
    .string()
    .trim()
    .regex(/^image\/(png|jpe?g|webp|gif|svg)$/),
})

export type GetUploadUrlBody = z.infer<typeof getUploadUrlSchema>
export const GetUploadUrlGateway = new ZodValidationPipe(getUploadUrlSchema)
