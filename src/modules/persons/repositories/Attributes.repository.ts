import { Repository } from '@shared/core/contracts/Repository'
import { Attribute } from '../entities/Attribute'
import { AttributePreview } from '../valuesObjects/AttributePreview'
import { AttributeToPerson } from '../entities/AttributeToPerson'

export abstract class AttributesRepository<T = unknown> extends Repository<
  Attribute,
  T
> {
  abstract findManyPreviewByProjectId(
    projectId: string,
    ctx?: T,
  ): Promise<AttributePreview[]>

  abstract createAttributeToPerson(
    attributeToPerson: AttributeToPerson,
    ctx?: T,
  ): Promise<void>
}
