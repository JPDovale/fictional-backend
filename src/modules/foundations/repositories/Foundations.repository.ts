import { Repository } from '@shared/core/contracts/Repository'
import { Foundation } from '../entities/Foundation'

export abstract class FoundationsRepository<T = unknown> extends Repository<
  Foundation,
  T
> {
  abstract findByProjectId(
    projectId: string,
    ctx?: T,
  ): Promise<Foundation | null>
}
