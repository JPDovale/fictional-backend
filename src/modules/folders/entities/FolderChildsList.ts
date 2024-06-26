import { WatchedList } from '@shared/core/entities/WatchedList'
import { Folder } from './Folder'

export class FolderChildsList extends WatchedList<Folder> {
  compareItems(a: Folder, b: Folder): boolean {
    return a.equals(b)
  }
}
