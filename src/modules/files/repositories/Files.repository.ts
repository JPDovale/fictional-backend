import { Repository } from '@shared/core/contracts/Repository'
import { File } from '../entities/File'

export abstract class FilesRepository<T = unknown> extends Repository<
  File,
  T
> {}
