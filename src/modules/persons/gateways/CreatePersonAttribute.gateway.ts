import { ZodValidationPipe } from '@shared/pipes/ZodValidation'
import { z } from 'zod'
import { AttributeType } from '../entities/types'

const createPersonAttributeBodySchema = z.object({
  type: z.nativeEnum(AttributeType),
})

export type CreatePersonAttributeBody = z.infer<
  typeof createPersonAttributeBodySchema
>
export const CreatePersonAttributeBodyGateway = new ZodValidationPipe(
  createPersonAttributeBodySchema,
)

const createPersonAttributeParamsSchema = z.object({
  projectId: z.string().trim().uuid(),
  personId: z.string().trim().uuid(),
})

export type CreatePersonAttributeParams = z.infer<
  typeof createPersonAttributeParamsSchema
>
export const CreatePersonAttributeParamsGateway = new ZodValidationPipe(
  createPersonAttributeParamsSchema,
)
