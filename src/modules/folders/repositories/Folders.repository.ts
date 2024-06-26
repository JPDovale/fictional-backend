import { Repository } from '@shared/core/contracts/Repository'
import { Folder } from '../entities/Folder'
import { FolderWithChilds } from '../valueObjects/FolderWithChilds'

export abstract class FoldersRepository<T = unknown> extends Repository<
  Folder,
  T
> {
  abstract getManyByProjectId(
    projectId: string,
    ctx?: T,
  ): Promise<FolderWithChilds[]>
}
